use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use crate::state::{Dao, Proposal};

#[derive(Accounts)]
pub struct Execute<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub dao: Account<'info, Dao>,
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
}

pub fn execute(ctx: Context<Execute>, proposal_id: u64) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    
    // Validate that proposal is not already executed
    require!(!proposal.is_executed, ErrorCode::ProposalExecuted);
    
    // Validate that voting period has ended (72 hours)
    let now = Clock::get()?.unix_timestamp;
    require!(now >= proposal.created_at + 259200, ErrorCode::ProposalOpen); // 72 hours = 259200 seconds
    
    // Validate majority approval (simple majority)
    let total_votes = proposal.votes_for + proposal.votes_against;
    require!(proposal.votes_for > total_votes / 2, ErrorCode::ProposalFailed);
    
    // Transfer funds from treasury to recipient
    // Note: In a real implementation, we'd need to handle the treasury as a PDA account
    // and transfer USDC from it to the recipient
    // For simplicity, we're assuming the treasury is a PDA that holds USDC
    
    // Mark proposal as executed
    proposal.is_executed = true;
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Proposal has already been executed")]
    ProposalExecuted,
    #[msg("Proposal voting period is still open")]
    ProposalOpen,
    #[msg("Proposal failed to achieve majority approval")]
    ProposalFailed,
}
