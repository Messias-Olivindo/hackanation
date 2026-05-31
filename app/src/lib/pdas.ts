import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { 
  PROGRAM_ID, 
  DAO_SEED, 
  TREASURY_SEED, 
  MEMBER_SEED, 
  PROPOSAL_SEED, 
  VOTE_RECORD_SEED 
} from "./solana";

/**
 * Deriva os endereços globais da DAO, Autoridade do Tesouro e PDA de Membro.
 */
export function getSellerDaoPdas(userPublicKey: PublicKey | null) {
  // 1. Principal DAO PDA
  const [daoPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(DAO_SEED)],
    PROGRAM_ID
  );

  // 2. Treasury Authority PDA
  const [treasuryAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from(TREASURY_SEED)],
    PROGRAM_ID
  );

  // 3. Member PDA (Único para cada carteira do usuário)
  let memberPda: PublicKey | null = null;
  if (userPublicKey) {
    [memberPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(MEMBER_SEED), userPublicKey.toBuffer()],
      PROGRAM_ID
    );
  }

  return { daoPda, treasuryAuthority, memberPda };
}

/**
 * Deriva a PDA de uma proposta específica a partir do seu ID numérico.
 */
export function getProposalPda(daoPda: PublicKey, proposalId: number | anchor.BN) {
  const proposalIdBn = typeof proposalId === "number" ? new anchor.BN(proposalId) : proposalId;
  const proposalSeed = Buffer.from(proposalIdBn.toArray("le", 8));
  
  const [proposalPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(PROPOSAL_SEED), daoPda.toBuffer(), proposalSeed],
    PROGRAM_ID
  );
  return proposalPda;
}

/**
 * Deriva a PDA de registro de voto para evitar voto duplo on-chain.
 */
export function getVoteRecordPda(proposalPda: PublicKey, memberPda: PublicKey) {
  const [voteRecordPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(VOTE_RECORD_SEED), proposalPda.toBuffer(), memberPda.toBuffer()],
    PROGRAM_ID
  );
  return voteRecordPda;
}
