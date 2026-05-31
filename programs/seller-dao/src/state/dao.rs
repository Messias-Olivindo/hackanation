// =============================================================================
// dao.rs — Estado global da DAO
// =============================================================================
//
// A conta Dao armazena o estado compartilhado de toda a organização:
// - Endereço da token account do treasury
// - Bumps das PDAs para verificação e assinatura
// - Contadores de membros e propostas
//
// Referência: Padrão de estado global usado em SPL Governance e Squads V3
// https://github.com/solana-labs/solana-program-library/tree/master/governance
// =============================================================================

use anchor_lang::prelude::*;

/// Conta principal da DAO — existe apenas uma instância por programa.
///
/// PDA derivada com seeds: [b"dao"]
///
/// Campos:
/// - `treasury_token_account`: Pubkey da ATA (Associated Token Account) do treasury.
///   Armazenada na criação para validação em transações futuras.
/// - `dao_bump`: Bump da PDA da DAO para re-derivação eficiente.
/// - `treasury_bump`: Bump da PDA de autoridade do treasury para assinaturas CPI.
/// - `total_members`: Contador de membros registrados na DAO.
/// - `proposal_count`: Contador sequencial de propostas criadas (usado como parte
///   da seed de cada proposta para garantir unicidade).
#[account]
pub struct Dao {
    /// Endereço da token account do treasury (controlada pela PDA treasury_authority)
    pub treasury_token_account: Pubkey,   // 32 bytes
    /// Bump da PDA da DAO [b"dao"]
    pub dao_bump: u8,                      // 1 byte
    /// Bump da PDA de autoridade do treasury [b"treasury"]
    pub treasury_bump: u8,                 // 1 byte
    /// Número total de membros ativos na DAO
    pub total_members: u64,                // 8 bytes
    /// Contador sequencial de propostas (incrementado a cada nova proposta)
    pub proposal_count: u64,               // 8 bytes
}

/// Espaço total da conta Dao em bytes.
/// Formato: discriminator (8) + pubkey (32) + u8 (1) + u8 (1) + u64 (8) + u64 (8) = 58
pub const DAO_SPACE: usize = 8 + 32 + 1 + 1 + 8 + 8;
