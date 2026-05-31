// =============================================================================
// join_dao.rs — Lógica da instrução de entrada na DAO
// =============================================================================
//
// Fluxo completo:
// 1. Valida que stake_amount > 0
// 2. Se é o primeiro membro (total_members == 0):
//    - Inicializa os campos da DAO (treasury_token_account, bumps)
// 3. Se já existem membros:
//    - Valida que a treasury_token_account é a mesma da DAO
// 4. Incrementa o contador de membros
// 5. Configura a conta do membro (user, stake, governance_tokens, bump)
// 6. Executa CPI transfer: user_token_account -> treasury_token_account
//
// Governance tokens:
// O membro recebe governance_tokens = stake_amount * 10.
// Esses tokens determinam o peso do voto em propostas futuras.
//
// Referência CPI Transfer:
// https://book.anchor-lang.com/anchor_in_depth/CPIs.html
// =============================================================================

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer};
use crate::dao_accounts::JoinDao;
use crate::errors::DaoError;

/// Handler da instrução join_dao.
///
/// # Argumentos
/// - `ctx` - Contexto com todas as contas validadas pelo Anchor
/// - `stake_amount` - Quantidade de tokens a depositar como stake
///
/// # Erros
/// - `DaoError::ZeroStake` - Se stake_amount for 0
/// - `DaoError::InvalidTreasuryAccount` - Se a treasury não corresponder à registrada
pub fn join_dao(ctx: Context<JoinDao>, stake_amount: u64) -> Result<()> {
    // Validação: stake precisa ser positivo
    require!(stake_amount > 0, DaoError::ZeroStake);

    // --- Configuração da DAO ---
    let dao = &mut ctx.accounts.dao;
    if dao.total_members == 0 {
        // Primeira chamada: inicializa a DAO com os endereços e bumps
        dao.treasury_token_account = ctx.accounts.treasury_token_account.key();
        dao.dao_bump = ctx.bumps.dao;
        dao.treasury_bump = ctx.bumps.treasury_authority;
        dao.proposal_count = 0;
    } else {
        // Chamadas subsequentes: valida que a treasury é a mesma
        require!(
            dao.treasury_token_account == ctx.accounts.treasury_token_account.key(),
            DaoError::InvalidTreasuryAccount
        );
    }
    // Incrementa contador de membros
    dao.total_members = dao.total_members.saturating_add(1);

    // --- Configuração do membro ---
    let member = &mut ctx.accounts.member;
    member.user = *ctx.accounts.user.key;
    member.stake = stake_amount;
    // Governance tokens proporcionais ao stake (10x multiplicador)
    member.governance_tokens = stake_amount.saturating_mul(10);
    member.sales_volume = 0;
    member.bump = ctx.bumps.member;

    // --- Transferência CPI: user -> treasury ---
    // Usa o programa SPL Token para transferir tokens do usuário para o treasury.
    // O user é o authority porque ele é quem assina a transação.
    let cpi_accounts = Transfer {
        from: ctx.accounts.user_token_account.to_account_info(),
        to: ctx.accounts.treasury_token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts,
    );
    token::transfer(cpi_ctx, stake_amount)?;

    Ok(())
}