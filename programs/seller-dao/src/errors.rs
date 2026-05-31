// =============================================================================
// errors.rs — Códigos de erro customizados do SellerDAO
// =============================================================================
//
// Cada variante do enum DaoError é mapeada para um código numérico pelo Anchor
// (começando em 6000). Esses erros são retornados nas instruções para comunicar
// falhas específicas ao cliente/frontend.
//
// Referência: https://book.anchor-lang.com/anchor_in_depth/errors.html
// =============================================================================

use anchor_lang::prelude::*;

/// Erros customizados do programa SellerDAO.
///
/// O Anchor atribui códigos sequenciais a partir de 6000:
/// - 6000 = NotMember
/// - 6001 = ZeroStake
/// - 6002 = DescriptionTooLong
/// - 6003 = ProposalClosed
/// - 6004 = ProposalOpen
/// - 6005 = ProposalExecuted
/// - 6006 = ProposalFailed
/// - 6007 = InsufficientTreasury
/// - 6008 = InvalidTreasuryAccount
/// - 6009 = TreasuryMintMismatch
#[error_code]
pub enum DaoError {
    /// Usuário não é membro registrado da DAO
    #[msg("User is not a member of the DAO")]
    NotMember,

    /// Valor de stake precisa ser maior que zero
    #[msg("Stake amount must be greater than zero")]
    ZeroStake,

    /// Descrição da proposta excede o limite máximo de caracteres
    #[msg("Proposal description too long")]
    DescriptionTooLong,

    /// Período de votação da proposta já encerrou (para votar)
    #[msg("Proposal voting period has closed")]
    ProposalClosed,

    /// Período de votação ainda está aberto (para executar)
    #[msg("Proposal voting period is still open")]
    ProposalOpen,

    /// Proposta já foi executada anteriormente
    #[msg("Proposal has already been executed")]
    ProposalExecuted,

    /// Proposta não atingiu maioria de votos a favor
    #[msg("Proposal failed to achieve majority approval")]
    ProposalFailed,

    /// Treasury não possui saldo suficiente para a transferência
    #[msg("Treasury has insufficient balance")]
    InsufficientTreasury,

    /// Token account do treasury não corresponde à registrada na DAO
    #[msg("Invalid treasury token account")]
    InvalidTreasuryAccount,

    /// Mint da token account do destinatário não corresponde à do treasury
    #[msg("Treasury token mint mismatch")]
    TreasuryMintMismatch,
}