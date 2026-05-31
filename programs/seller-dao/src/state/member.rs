// =============================================================================
// member.rs — Estado de cada membro da DAO
// =============================================================================
//
// Cada membro possui uma conta PDA única derivada com seeds:
//   [b"member", user_pubkey]
//
// Armazena o stake depositado, governance tokens recebidos e volume de vendas.
// Os governance tokens determinam o peso do voto de cada membro.
//
// Referência: Padrão de membership usado em Tribeca e Squads
// https://github.com/TribecaHQ/tribeca
// =============================================================================

use anchor_lang::prelude::*;

/// Conta de membro da DAO — uma por usuário.
///
/// PDA derivada com seeds: [b"member", user.key().as_ref()]
///
/// Campos:
/// - `user`: Pubkey do wallet do membro (chave pública Solana).
/// - `stake`: Quantidade de tokens depositados como stake na entrada.
/// - `governance_tokens`: Tokens de governança recebidos (proporcional ao stake).
///   Determinam o peso do voto do membro nas propostas.
/// - `sales_volume`: Volume de vendas acumulado (para futuras distribuições por mérito).
/// - `bump`: Bump da PDA para re-derivação.
#[account]
pub struct Member {
    /// Chave pública do wallet do membro
    pub user: Pubkey,              // 32 bytes
    /// Quantidade de tokens depositados como stake
    pub stake: u64,                // 8 bytes
    /// Governance tokens recebidos (peso do voto = governance_tokens)
    pub governance_tokens: u64,    // 8 bytes
    /// Volume de vendas acumulado do membro (reservado para uso futuro)
    pub sales_volume: u64,         // 8 bytes
    /// Bump da PDA do membro
    pub bump: u8,                  // 1 byte
}

/// Espaço total da conta Member em bytes.
/// Formato: discriminator (8) + pubkey (32) + u64 (8) + u64 (8) + u64 (8) + u8 (1) = 65
pub const MEMBER_SPACE: usize = 8 + 32 + 8 + 8 + 8 + 1;
