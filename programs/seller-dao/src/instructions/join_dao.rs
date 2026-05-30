use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use crate::state::{Dao, Member};

#[derive(Accounts)]
pub struct JoinDao<'info> {
    #[account(init, payer = user, space = 8 + 32 + 8 + 8 + 32)]
    pub member: Account<'info, Member>,
    #[account(init, payer = user, space = 8 + 32 + 8 + 8)]
    pub dao: Account<'info, Dao>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn join_dao(ctx: Context<JoinDao>, stake_amount: u64) -> Result<()> {
    // Create DAO if it doesn't exist
    let dao = &mut ctx.accounts.dao;
    dao.treasury = Pubkey::find_program_address(&[b"treasury"], ctx.program_id).0;
    dao.total_members = 1;
    
    // Create member account
    let member = &mut ctx.accounts.member;
    member.user = *ctx.accounts.user.key;
    member.stake = stake_amount;
    member.governance_tokens = stake_amount * 10; // Simple proportional model
    member.sales_volume = 0; // Will be updated via Chainlink CRE
    
    // Transfer USDC from user to treasury
    let treasury = Pubkey::find_program_address(&[b"treasury"], ctx.program_id).0;
    let cpi_accounts = Transfer {
        from: ctx.accounts.user.to_account_info(),
        to: ctx.accounts.system_program.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_program = ctx.accounts.system_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, stake_amount)?;
    
    Ok(())
}