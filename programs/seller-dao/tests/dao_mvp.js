const anchor = require("@coral-xyz/anchor");
const { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } = require("@solana/web3.js");
const {
  createMint,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} = require("@solana/spl-token");
const { assert } = require("chai");

const DAO_SEED = Buffer.from("dao");
const TREASURY_SEED = Buffer.from("treasury");
const MEMBER_SEED = Buffer.from("member");
const PROPOSAL_SEED = Buffer.from("proposal");
const VOTE_SEED = Buffer.from("vote");

async function warpForwardSlots(connection, slots) {
  const current = await connection.getSlot();
  await connection._rpcRequest("warpSlot", [current + slots]);
}

describe("seller-dao mvp", () => {
  const connection = new anchor.web3.Connection("http://127.0.0.1:8899", "confirmed");
  const user = Keypair.generate();
  const wallet = new anchor.Wallet(user);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
  });
  anchor.setProvider(provider);

  const idl = require("../target/idl/seller_dao.json");
  const programId = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
  const program = new anchor.Program(idl, programId, provider);
  const recipient = Keypair.generate();

  let mint;
  let userTokenAccount;
  let treasuryTokenAccount;
  let recipientTokenAccount;
  let daoPda;
  let treasuryAuthority;
  let memberPda;
  let altRecipientTokenAccount;

  before(async () => {
    const signature = await provider.connection.requestAirdrop(
      user.publicKey,
      2_000_000_000
    );
    await provider.connection.confirmTransaction(signature, "confirmed");
  });

  it("join_dao initializes DAO and member", async () => {
    [daoPda] = PublicKey.findProgramAddressSync([DAO_SEED], program.programId);
    [treasuryAuthority] = PublicKey.findProgramAddressSync([TREASURY_SEED], program.programId);
    [memberPda] = PublicKey.findProgramAddressSync(
      [MEMBER_SEED, user.publicKey.toBuffer()],
      program.programId
    );

    mint = await createMint(
      provider.connection,
      user,
      user.publicKey,
      null,
      6
    );

    const userAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      mint,
      user.publicKey
    );
    userTokenAccount = userAta.address;

    treasuryTokenAccount = await getAssociatedTokenAddress(
      mint,
      treasuryAuthority,
      true
    );

    await mintTo(
      provider.connection,
      user,
      mint,
      userTokenAccount,
      user,
      1_000_000
    );

    await program.methods
      .joinDao(new anchor.BN(100_000))
      .accounts({
        dao: daoPda,
        member: memberPda,
        treasuryAuthority,
        treasuryTokenAccount,
        userTokenAccount,
        mint,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const daoAccount = await program.account.dao.fetch(daoPda);
    const memberAccount = await program.account.member.fetch(memberPda);

    assert.equal(daoAccount.totalMembers.toNumber(), 1);
    assert.equal(memberAccount.user.toBase58(), user.publicKey.toBase58());
  });

  it("propose, vote, and execute", async () => {
    const daoAccount = await program.account.dao.fetch(daoPda);
    const proposalId = daoAccount.proposalCount;
    const proposalSeed = Buffer.from(proposalId.toArray("le", 8));

    const [proposalPda] = PublicKey.findProgramAddressSync(
      [PROPOSAL_SEED, daoPda.toBuffer(), proposalSeed],
      program.programId
    );

    const recipientAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      mint,
      recipient.publicKey
    );
    recipientTokenAccount = recipientAta.address;

    const altRecipientAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user,
      mint,
      Keypair.generate().publicKey
    );
    altRecipientTokenAccount = altRecipientAta.address;

    await program.methods
      .propose("Buy inventory", new anchor.BN(50_000), recipientTokenAccount)
      .accounts({
        member: memberPda,
        dao: daoPda,
        proposal: proposalPda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const [voteRecordPda] = PublicKey.findProgramAddressSync(
      [VOTE_SEED, proposalPda.toBuffer(), memberPda.toBuffer()],
      program.programId
    );

    await program.methods
      .vote(proposalId, true)
      .accounts({
        member: memberPda,
        proposal: proposalPda,
        dao: daoPda,
        voteRecord: voteRecordPda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Wait for the 5 seconds voting period to end
    await new Promise((resolve) => setTimeout(resolve, 6000));

    await program.methods
      .execute(proposalId)
      .accounts({
        proposal: proposalPda,
        dao: daoPda,
        treasuryAuthority,
        treasuryTokenAccount,
        recipientTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const treasuryBalance = await provider.connection.getTokenAccountBalance(
      treasuryTokenAccount
    );
    const recipientBalance = await provider.connection.getTokenAccountBalance(
      recipientTokenAccount
    );

    assert.equal(recipientBalance.value.amount, "50000");
    assert.equal(treasuryBalance.value.amount, "50000");
  });

  it("prevents double voting", async () => {
    const daoAccount = await program.account.dao.fetch(daoPda);
    const proposalId = daoAccount.proposalCount.sub(new anchor.BN(1));
    const proposalSeed = Buffer.from(proposalId.toArray("le", 8));

    const [proposalPda] = PublicKey.findProgramAddressSync(
      [PROPOSAL_SEED, daoPda.toBuffer(), proposalSeed],
      program.programId
    );

    const [voteRecordPda] = PublicKey.findProgramAddressSync(
      [VOTE_SEED, proposalPda.toBuffer(), memberPda.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .vote(proposalId, true)
        .accounts({
          member: memberPda,
          proposal: proposalPda,
          dao: daoPda,
          voteRecord: voteRecordPda,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("Expected double vote to fail");
    } catch (err) {
      assert.ok(err);
    }
  });

  it("rejects zero target proposals", async () => {
    const daoAccount = await program.account.dao.fetch(daoPda);
    const proposalId = daoAccount.proposalCount;
    const proposalSeed = Buffer.from(proposalId.toArray("le", 8));

    const [proposalPda] = PublicKey.findProgramAddressSync(
      [PROPOSAL_SEED, daoPda.toBuffer(), proposalSeed],
      program.programId
    );

    try {
      await program.methods
        .propose("Zero target", new anchor.BN(0), recipientTokenAccount)
        .accounts({
          member: memberPda,
          dao: daoPda,
          proposal: proposalPda,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("Expected zero target proposal to fail");
    } catch (err) {
      assert.ok(err);
    }
  });

  it("rejects execution with wrong recipient token account", async () => {
    const daoAccount = await program.account.dao.fetch(daoPda);
    const proposalId = daoAccount.proposalCount;
    const proposalSeed = Buffer.from(proposalId.toArray("le", 8));

    const [proposalPda] = PublicKey.findProgramAddressSync(
      [PROPOSAL_SEED, daoPda.toBuffer(), proposalSeed],
      program.programId
    );

    await program.methods
      .propose("Wrong recipient", new anchor.BN(1_000), recipientTokenAccount)
      .accounts({
        member: memberPda,
        dao: daoPda,
        proposal: proposalPda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const [voteRecordPda] = PublicKey.findProgramAddressSync(
      [VOTE_SEED, proposalPda.toBuffer(), memberPda.toBuffer()],
      program.programId
    );

    await program.methods
      .vote(proposalId, true)
      .accounts({
        member: memberPda,
        proposal: proposalPda,
        dao: daoPda,
        voteRecord: voteRecordPda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    await new Promise((resolve) => setTimeout(resolve, 6000));

    try {
      await program.methods
        .execute(proposalId)
        .accounts({
          proposal: proposalPda,
          dao: daoPda,
          treasuryAuthority,
          treasuryTokenAccount,
          recipientTokenAccount: altRecipientTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      assert.fail("Expected execute with wrong recipient to fail");
    } catch (err) {
      assert.ok(err);
    }
  });
});
