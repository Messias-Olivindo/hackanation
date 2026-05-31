// =============================================================================
// vote_record.rs — Registro de voto individual
// =============================================================================
//
// Cada VoteRecord é uma PDA única derivada com seeds:
//   [b"vote", proposal_key, member_key]
//
// Esta PDA garante que cada membro só possa votar UMA VEZ por proposta.
// A tentativa de criar um VoteRecord duplicado resultará em erro de inicialização
// do Anchor ("account already initialized"), impedindo voto duplo sem lógica extra.
//
// Referência: Padrão anti-double-vote usado em SPL Governance
// https://github.com/solana-labs/solana-program-library/tree/master/governance
// =============================================================================

use anchor_lang::prelude::*;

/// Registro de voto de um membro em uma proposta específica.
///
/// PDA derivada com seeds: [b"vote", proposal.key(), member.key()]
///
/// A existência desta PDA é o mecanismo anti-voto-duplo:
/// se o membro tentar votar de novo, o `init` falhará porque
/// a conta PDA com essas seeds já existe.
#[account]
pub struct VoteRecord {
    /// Pubkey da proposta votada
    pub proposal: Pubkey,   // 32 bytes
    /// Pubkey do wallet do votante
    pub voter: Pubkey,      // 32 bytes
    /// true = a favor, false = contra
    pub approve: bool,      // 1 byte
    /// Peso do voto (= governance_tokens do membro no momento do voto)
    pub weight: u64,        // 8 bytes
    /// Bump da PDA do VoteRecord
    pub bump: u8,           // 1 byte
}

/// Espaço total da conta VoteRecord em bytes.
/// Formato: discriminator (8) + proposal (32) + voter (32) + approve (1) + weight (8) + bump (1) = 82
pub const VOTE_RECORD_SPACE: usize = 8 + 32 + 32 + 1 + 8 + 1;
