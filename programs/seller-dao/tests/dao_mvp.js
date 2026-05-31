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

const fs = require("fs");
const os = require("os");
const path = require("path");
const { Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");

const DAO_SEED = Buffer.from("dao_v2");
const TREASURY_SEED = Buffer.from("treasury");
const MEMBER_SEED = Buffer.from("member");
const PROPOSAL_SEED = Buffer.from("proposal");
const VOTE_SEED = Buffer.from("vote");

async function warpForwardSlots(connection, slots) {
  const current = await connection.getSlot();
  await connection._rpcRequest("warpSlot", [current + slots]);
}

describe("seller-dao mvp", () => {
  const envProvider = anchor.AnchorProvider.env();
  const connection = envProvider.connection;
  const user = Keypair.generate();
  const wallet = new anchor.Wallet(user);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
  });
  anchor.setProvider(provider);

  const idl = require("../target/idl/seller_dao.json");
  const programId = anchor.workspace.SellerDao ? anchor.workspace.SellerDao.programId : new PublicKey("FPezMd8XbqDEYXsDgqRW7bpGQ6HDdnjnzMbKpNMjcPkL");
  console.log("--- TEST CONFIGURATION ---");
  console.log("Connection RPC URL:", connection._rpcEndpoint);
  console.log("Workspace SellerDao exists:", !!anchor.workspace.SellerDao);
  if (anchor.workspace.SellerDao) {
    console.log("Workspace Program ID:", anchor.workspace.SellerDao.programId.toBase58());
  }
  console.log("Resolved Program ID in JS:", programId.toBase58());
  console.log("--------------------------");
  const program = new anchor.Program(idl, programId, provider);
  const recipient = Keypair.generate();

  // Load or generate a persistent mint keypair to make tests re-runnable on Devnet
  let mintKeypair;
  const mintPath = path.join(__dirname, "mint_persistent.json");
  try {
    const mintSecret = JSON.parse(fs.readFileSync(mintPath, "utf-8"));
    mintKeypair = Keypair.fromSecretKey(Uint8Array.from(mintSecret));
    console.log("Loaded persistent mint from file:", mintKeypair.publicKey.toBase58());
  } catch (e) {
    mintKeypair = Keypair.generate();
    fs.writeFileSync(mintPath, JSON.stringify(Array.from(mintKeypair.secretKey)));
    console.log("Generated and saved new persistent mint:", mintKeypair.publicKey.toBase58());
  }

  let mint;
  let userTokenAccount;
  let treasuryTokenAccount;
  let recipientTokenAccount;
  let daoPda;
  let treasuryAuthority;
  let memberPda;
  let altRecipientTokenAccount;

  before(async () => {
    let activeWalletKeypair;
    try {
      const walletPath = process.env.ANCHOR_WALLET || path.join(os.homedir(), ".config/solana/id.json");
      console.log("Loading active wallet from:", walletPath);
      const walletSecret = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
      activeWalletKeypair = Keypair.fromSecretKey(Uint8Array.from(walletSecret));
    } catch (e) {
      console.log("Failed to load active wallet keypair, trying faucet standard airdrop:", e.message);
    }

    if (activeWalletKeypair) {
      const activeBalance = await connection.getBalance(activeWalletKeypair.publicKey);
      console.log(`Active CLI wallet balance: ${activeBalance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
      
      if (activeBalance >= 0.2 * anchor.web3.LAMPORTS_PER_SOL) {
        console.log("Funding test user from active CLI wallet...");
        const transferTx = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: activeWalletKeypair.publicKey,
            toPubkey: user.publicKey,
            lamports: 0.15 * anchor.web3.LAMPORTS_PER_SOL,
          })
        );
        const signature = await sendAndConfirmTransaction(connection, transferTx, [activeWalletKeypair]);
        console.log("Funded test user successfully. Tx:", signature);
      } else {
        console.log("Active CLI wallet balance is too low, attempting airdrop...");
        const signature = await connection.requestAirdrop(user.publicKey, 1_000_000_000);
        await connection.confirmTransaction(signature, "confirmed");
      }
    } else {
      console.log("No active CLI wallet found, attempting airdrop...");
      const signature = await connection.requestAirdrop(user.publicKey, 1_000_000_000);
      await connection.confirmTransaction(signature, "confirmed");
    }

    const testUserBalance = await connection.getBalance(user.publicKey);
    console.log(`Test user funded. Balance: ${testUserBalance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
  });

  it("join_dao initializes DAO and member", async () => {
    [daoPda] = PublicKey.findProgramAddressSync([DAO_SEED], program.programId);
    [treasuryAuthority] = PublicKey.findProgramAddressSync([TREASURY_SEED], program.programId);
    [memberPda] = PublicKey.findProgramAddressSync(
      [MEMBER_SEED, user.publicKey.toBuffer()],
      program.programId
    );

    // Get initial members count if DAO exists on-chain
    let initialMembers = 0;
    try {
      const existingDao = await program.account.dao.fetch(daoPda);
      initialMembers = existingDao.totalMembers.toNumber();
      console.log("DAO already initialized on-chain. Initial members:", initialMembers);
    } catch (e) {
      console.log("DAO not initialized yet on-chain. Initial members: 0");
    }

    mint = mintKeypair.publicKey;
    const mintAccountInfo = await provider.connection.getAccountInfo(mint);
    if (mintAccountInfo) {
      console.log("Persistent mint already exists on-chain:", mint.toBase58());
    } else {
      console.log("Persistent mint does not exist. Creating it:", mint.toBase58());
      await createMint(
        provider.connection,
        user,
        user.publicKey,
        null,
        6,
        mintKeypair
      );
    }

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

    await new Promise((resolve) => setTimeout(resolve, 1500));

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

    assert.equal(daoAccount.totalMembers.toNumber(), initialMembers + 1);
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

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const [voteRecordPda] = PublicKey.findProgramAddressSync(
      [VOTE_SEED, proposalPda.toBuffer(), memberPda.toBuffer()],
      program.programId
    );

    console.log("--- DEBUGGING VOTE ---");
    console.log("proposalPda:", proposalPda.toBase58());
    try {
      const accountInfo = await program.provider.connection.getAccountInfo(proposalPda);
      console.log("Proposal account owner:", accountInfo.owner.toBase58());
      const proposalAcc = await program.account.proposal.fetch(proposalPda);
      console.log("Fetched proposal exists! Proposer:", proposalAcc.proposer.toBase58());
      console.log("Proposal ID:", proposalAcc.proposalId.toString());
      console.log("Description:", proposalAcc.description);
    } catch (e) {
      console.log("Failed to fetch proposal account:", e.message);
    }
    console.log("----------------------");

    const ix = await program.methods
      .vote(proposalId, true)
      .accounts({
        member: memberPda,
        proposal: proposalPda,
        dao: daoPda,
        voteRecord: voteRecordPda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
    console.log("--- VOTE IX ACCOUNTS ---");
    ix.keys.forEach((k, i) => console.log(`${i}: pubkey=${k.pubkey.toBase58()} isSigner=${k.isSigner} isWritable=${k.isWritable}`));
    console.log("------------------------");

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
    } catch (err) {
      console.log("--- VOTE TRANSACTION LOGS ---");
      if (err.logs) {
        console.log(err.logs.join("\n"));
      } else {
        console.log(err);
      }
      console.log("-----------------------------");
      throw err;
    }

    // Wait for the 60 seconds voting period to end
    await new Promise((resolve) => setTimeout(resolve, 61000));

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

    await new Promise((resolve) => setTimeout(resolve, 1500));

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
    } catch (err) {
      console.log("--- TEST 5 VOTE TRANSACTION LOGS ---");
      if (err.logs) {
        console.log(err.logs.join("\n"));
      } else {
        console.log(err);
      }
      console.log("-------------------------------------");
      throw err;
    }

    await new Promise((resolve) => setTimeout(resolve, 61000));

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
