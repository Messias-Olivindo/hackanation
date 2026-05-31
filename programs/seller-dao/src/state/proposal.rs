// =============================================================================
// proposal.rs — Estado de cada proposta de governança
// =============================================================================
//
// Cada proposta possui uma conta PDA única derivada com seeds:
//   [b"proposal", dao_key, proposal_count_le_bytes]
//
// A proposta armazena a descrição, valor alvo, destinatário, contagem de votos,
// timestamp de criação e flag de execução.
//
// Referência: Padrão de propostas em SPL Governance
// https://github.com/solana-labs/solana-program-library/tree/master/governance
// =============================================================================

use anchor_lang::prelude::*;

/// Conta de proposta da DAO.
///
/// PDA derivada com seeds: [b"proposal", dao.key(), proposal_count.to_le_bytes()]
///
/// O campo `description` usa String com tamanho máximo definido por MAX_DESCRIPTION_LEN.
/// Anchor serializa Strings com um prefixo de 4 bytes para o comprimento,
/// por isso o cálculo de espaço inclui 4 + MAX_DESCRIPTION_LEN.
#[account]
pub struct Proposal {
    /// Pubkey do membro que criou a proposta
    pub proposer: Pubkey,          // 32 bytes
    /// ID sequencial da proposta (baseado em dao.proposal_count no momento da criação)
    pub proposal_id: u64,          // 8 bytes
    /// Descrição da proposta (max 280 caracteres, como um tweet)
    pub description: String,       // 4 + MAX_DESCRIPTION_LEN bytes
    /// Valor em tokens que a proposta pede do treasury
    pub target_amount: u64,        // 8 bytes
    /// Pubkey da token account que receberá os fundos se aprovada
    pub recipient: Pubkey,         // 32 bytes
    /// Total de votos a favor (ponderados por governance_tokens)
    pub votes_for: u64,            // 8 bytes
    /// Total de votos contra (ponderados por governance_tokens)
    pub votes_against: u64,        // 8 bytes
    /// Timestamp Unix da criação da proposta (usado para verificar janela de votação)
    pub created_at: i64,           // 8 bytes
    /// Flag indicando se a proposta já foi executada (impede execução duplicada)
    pub is_executed: bool,         // 1 byte
    /// Bump da PDA da proposta
    pub bump: u8,                  // 1 byte
}

/// Comprimento máximo da descrição da proposta em bytes.
pub const MAX_DESCRIPTION_LEN: usize = 280;

/// Espaço total da conta Proposal em bytes.
/// Formato: discriminator (8) + proposer (32) + proposal_id (8) + string_prefix (4)
///          + description (280) + target_amount (8) + recipient (32) + votes_for (8)
///          + votes_against (8) + created_at (8) + is_executed (1) + bump (1) = 398
pub const PROPOSAL_SPACE: usize = 8 + 32 + 8 + 4 + MAX_DESCRIPTION_LEN + 8 + 32 + 8 + 8 + 8 + 1 + 1;
