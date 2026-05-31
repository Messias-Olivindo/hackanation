// =============================================================================
// execute.rs — Lógica da instrução de execução de proposta
// =============================================================================
//
// Fluxo:
// 1. Valida que a proposta não foi executada anteriormente
// 2. Verifica que o período de votação encerrou (now >= created_at + VOTING_PERIOD)
// 3. Verifica que a proposta teve maioria de votos a favor
// 4. Verifica que o treasury tem saldo suficiente
// 5. Executa CPI transfer com PDA signer: treasury -> recipient
// 6. Marca a proposta como executada (is_executed = true)
//
// CPI com PDA Signer:
// A token account do treasury é controlada pela PDA treasury_authority
// (seeds: [b"treasury"]). Para transferir tokens, precisamos criar um
// CpiContext::new_with_signer e fornecer as seeds + bump como "assinatura".
// Isso permite que o programa assine transações em nome da PDA.
//
// Referência: https://book.anchor-lang.com/anchor_in_depth/CPIs.html
// Referência: https://solana.com/docs/core/pda#how-to-sign-with-a-pda
// =============================================================================

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer};
use crate::dao_accounts::Execute;
use crate::errors::DaoError;
use crate::state::{VOTING_PERIOD_SECONDS, TREASURY_SEED};

/// Handler da instrução execute.
///
/// # Argumentos
/// - `ctx` - Contexto com todas as contas validadas
/// - `_proposal_id` - ID da proposta (parte da API, validação via PDA seeds)
///
/// # Erros
/// - `DaoError::ProposalExecuted` - Se a proposta já foi executada
/// - `DaoError::ProposalOpen` - Se o período de votação ainda não encerrou
/// - `DaoError::ProposalFailed` - Se não houve maioria de votos a favor
/// - `DaoError::InsufficientTreasury` - Se o treasury não tem saldo suficiente
pub fn execute(ctx: Context<Execute>, _proposal_id: u64) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;

    // Validação 1: proposta não pode ter sido executada anteriormente
    require!(!proposal.is_executed, DaoError::ProposalExecuted);

    // Validação 2: período de votação deve ter encerrado
    let now = Clock::get()?.unix_timestamp;
    require!(
        now >= proposal.created_at + VOTING_PERIOD_SECONDS,
        DaoError::ProposalOpen
    );

    // Validação 3: maioria simples de votos a favor
    let total_votes = proposal.votes_for + proposal.votes_against;
    require!(
        proposal.votes_for > total_votes / 2,
        DaoError::ProposalFailed
    );

    // Validação 4: treasury precisa ter saldo suficiente
    require!(
        ctx.accounts.treasury_token_account.amount >= proposal.target_amount,
        DaoError::InsufficientTreasury
    );

    // --- CPI Transfer com PDA Signer ---
    // A treasury_authority PDA assina a transferência usando as seeds.
    let cpi_accounts = Transfer {
        from: ctx.accounts.treasury_token_account.to_account_info(),
        to: ctx.accounts.recipient_token_account.to_account_info(),
        authority: ctx.accounts.treasury_authority.to_account_info(),
    };

    // Seeds para assinatura PDA: [b"treasury", bump]
    let signer_seeds: &[&[&[u8]]] = &[&[
        TREASURY_SEED,
        &[ctx.accounts.dao.treasury_bump],
    ]];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
        signer_seeds,
    );
    token::transfer(cpi_ctx, proposal.target_amount)?;

    // Marca a proposta como executada para impedir execução duplicada
    proposal.is_executed = true;

    Ok(())
}
