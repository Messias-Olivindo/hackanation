import { PublicKey } from "@solana/web3.js";
import idl from "./seller_dao.json";

// Program ID oficial implantado no Solana Devnet
export const PROGRAM_ID = new PublicKey("FPezMd8XbqDEYXsDgqRW7bpGQ6HDdnjnzMbKpNMjcPkL");

// IDL do programa para comunicação via Anchor
export const SELLER_DAO_IDL = idl;

// RPC padrão para Devnet (Pode ser substituído por Helius/QuickNode em produção)
export const DEVNET_RPC = "https://api.devnet.solana.com";

// Endereço público do token Mint persistente de Staking/Governança
export const MINT_ADDRESS = new PublicKey("DPd4G6RYKrmYKnYTjRRhpJhR45JJjs1mXnkoXibbd5Sg");

// Seeds de derivação das PDAs (exatamente iguais ao smart contract Rust)
export const DAO_SEED = "dao_v2";
export const TREASURY_SEED = "treasury";
export const MEMBER_SEED = "member";
export const PROPOSAL_SEED = "proposal";
export const VOTE_RECORD_SEED = "vote";
