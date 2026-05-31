// =============================================================================
// propose.rs — Lógica da instrução de criação de proposta
// =============================================================================
//
// Fluxo:
// 1. Valida que o user é dono da conta member (anti-impersonation)
// 2. Valida que a descrição não excede MAX_DESCRIPTION_LEN
// 3. Inicializa todos os campos da proposta
// 4. Registra o timestamp de criação para a janela de votação
// 5. Incrementa o proposal_count da DAO
//
// A janela de votação é calculada como:
//   created_at + VOTING_PERIOD_SECONDS
//
// Referência: Padrão de criação de propostas em SPL Governance
// https://github.com/solana-labs/solana-program-library/tree/master/governance
// =============================================================================

use anchor_lang::prelude::*;
use crate::dao_accounts::Propose;
use crate::errors::DaoError;
use crate::state::MAX_DESCRIPTION_LEN;

/// Handler da instrução propose.
///
/// # Argumentos
/// - `ctx` - Contexto com todas as contas validadas
/// - `description` - Texto descritivo da proposta (max 280 chars)
/// - `target_amount` - Valor em tokens solicitado do treasury
/// - `recipient` - Pubkey da token account destinatária
///
/// # Erros
/// - `DaoError::NotMember` - Se user não é o dono da conta member
/// - `DaoError::DescriptionTooLong` - Se descrição excede 280 chars
pub fn propose(
    ctx: Context<Propose>,
    description: String,
    target_amount: u64,
    recipient: Pubkey,
) -> Result<()> {
    // Validação: somente o dono da conta member pode criar propostas
    require!(
        ctx.accounts.member.user == *ctx.accounts.user.key,
        DaoError::NotMember
    );

    // Validação: descrição dentro do limite
    require!(
        description.len() <= MAX_DESCRIPTION_LEN,
        DaoError::DescriptionTooLong
    );

    // --- Configuração da proposta ---
    let proposal = &mut ctx.accounts.proposal;
    proposal.proposer = ctx.accounts.member.user;
    proposal.proposal_id = ctx.accounts.dao.proposal_count;
    proposal.description = description;
    proposal.target_amount = target_amount;
    proposal.recipient = recipient;
    proposal.votes_for = 0;
    proposal.votes_against = 0;
    // Timestamp atual — usado para calcular fim da janela de votação
    proposal.created_at = Clock::get()?.unix_timestamp;
    proposal.is_executed = false;
    proposal.bump = ctx.bumps.proposal;

    // Incrementa o contador global de propostas da DAO
    ctx.accounts.dao.proposal_count = ctx.accounts.dao.proposal_count.saturating_add(1);

    Ok(())
}
