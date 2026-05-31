import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { getSellerDaoPdas, getProposalPda, getVoteRecordPda } from "../lib/pdas";
import { PROGRAM_ID, SELLER_DAO_IDL } from "../lib/solana";
import { 
  getAssociatedTokenAddress, 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID 
} from "@solana/spl-token";

export function useSellerDao() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const getProgram = () => {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
      throw new Error("Wallet não conectada!");
    }
    const provider = new AnchorProvider(
      connection, 
      wallet as any, 
      { preflightCommitment: "processed" }
    );
    return new Program(SELLER_DAO_IDL as any, PROGRAM_ID, provider);
  };

  /**
   * Realiza o Staking de Tokens para se registrar/entrar na DAO.
   * @param amountToStake Quantidade de tokens (com decimais inclusos) para o stake.
   * @param tokenMintAddress Endereço público do token (geralmente MINT_ADDRESS).
   */
  const joinDao = async (amountToStake: number | BN, tokenMintAddress: PublicKey) => {
    const program = getProgram();
    const { daoPda, treasuryAuthority, memberPda } = getSellerDaoPdas(wallet.publicKey);
    
    if (!wallet.publicKey || !memberPda) throw new Error("Wallet não inicializada");

    const userTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, wallet.publicKey);
    const treasuryTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, treasuryAuthority, true);

    const tx = await program.methods
      .joinDao(new BN(amountToStake))
      .accounts({
        dao: daoPda,
        member: memberPda,
        treasuryAuthority,
        treasuryTokenAccount,
        userTokenAccount,
        mint: tokenMintAddress,
        user: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();
      
    await connection.confirmTransaction(tx, "confirmed");
    return tx;
  };

  /**
   * Cria uma nova proposta de orçamento ou transferência do tesouro.
   * @param title Título da proposta.
   * @param description Breve descrição ou justificativa.
   * @param amountToTransfer Valor a ser repassado do tesouro caso aprovada.
   * @param tokenMintAddress Endereço público do token do tesouro.
   * @param recipientWalletAddress Endereço da carteira do fornecedor que receberá o repasse.
   */
  const propose = async (
    title: string, 
    description: string, 
    amountToTransfer: number | BN, 
    tokenMintAddress: PublicKey, 
    recipientWalletAddress: PublicKey
  ) => {
    const program = getProgram();
    const { daoPda, memberPda } = getSellerDaoPdas(wallet.publicKey);
    
    if (!wallet.publicKey || !memberPda) throw new Error("Wallet não inicializada");

    // Consulta o estado global para determinar o ID sequencial da nova proposta
    const daoState = await program.account.dao.fetch(daoPda);
    const proposalId = daoState.proposalCount;
    const proposalPda = getProposalPda(daoPda, proposalId);

    const recipientTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, recipientWalletAddress);

    const tx = await program.methods
      .propose(title, description, new BN(amountToTransfer))
      .accounts({
        dao: daoPda,
        proposal: proposalPda,
        member: memberPda,
        recipientTokenAccount,
        proposer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    await connection.confirmTransaction(tx, "confirmed");
    return tx;
  };

  /**
   * Envia um voto de aprovação ou rejeição para uma proposta.
   * @param proposalId ID numérico da proposta.
   * @param approve true para SIM (Aprovar), false para NÃO (Rejeitar).
   */
  const vote = async (proposalId: number | BN, approve: boolean) => {
    const program = getProgram();
    const { daoPda, memberPda } = getSellerDaoPdas(wallet.publicKey);
    
    if (!wallet.publicKey || !memberPda) throw new Error("Wallet não inicializada");
    
    const proposalIdBn = typeof proposalId === "number" ? new BN(proposalId) : proposalId;
    const proposalPda = getProposalPda(daoPda, proposalIdBn);
    const voteRecordPda = getVoteRecordPda(proposalPda, memberPda);

    const tx = await program.methods
      .vote(proposalIdBn, approve)
      .accounts({
        dao: daoPda,
        proposal: proposalPda,
        member: memberPda,
        voteRecord: voteRecordPda,
        voter: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    await connection.confirmTransaction(tx, "confirmed");
    return tx;
  };

  /**
   * Executa uma proposta aprovada após a expiração da janela de votação.
   * Dispara a transferência USDC on-chain do tesouro diretamente para o fornecedor.
   * @param proposalId ID numérico da proposta.
   * @param tokenMintAddress Endereço do token USDC do tesouro.
   * @param recipientWalletAddress Endereço da carteira do fornecedor beneficiário.
   */
  const execute = async (
    proposalId: number | BN, 
    tokenMintAddress: PublicKey, 
    recipientWalletAddress: PublicKey
  ) => {
    const program = getProgram();
    const { daoPda, treasuryAuthority } = getSellerDaoPdas(wallet.publicKey);
    
    if (!wallet.publicKey) throw new Error("Wallet não inicializada");
    
    const proposalIdBn = typeof proposalId === "number" ? new BN(proposalId) : proposalId;
    const proposalPda = getProposalPda(daoPda, proposalIdBn);

    const treasuryTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, treasuryAuthority, true);
    const recipientTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, recipientWalletAddress);

    const tx = await program.methods
      .execute(proposalIdBn)
      .accounts({
        dao: daoPda,
        proposal: proposalPda,
        treasuryAuthority,
        treasuryTokenAccount,
        recipientTokenAccount,
        executor: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    await connection.confirmTransaction(tx, "confirmed");
    return tx;
  };

  return { joinDao, propose, vote, execute };
}
export type UseSellerDaoReturn = ReturnType<typeof useSellerDao>;
