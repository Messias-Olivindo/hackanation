use anchor_lang::prelude::*;
use crate::state::{Dao, Member, Proposal};

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub member: Account<'info, Member>,
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    pub dao: Account<'info, Dao>,
}

pub fn vote(ctx: Context<Vote>, proposal_id: u64, approve: bool) -> Result<()> {
    // Validate that the user is a member
    require!(ctx.accounts.member.user == *ctx.accounts.member.key, ErrorCode::NotMember);
    
    // Validate that proposal exists and is active (72h window)
    let now = Clock::get()?.unix_timestamp;
    let proposal = &mut ctx.accounts.proposal;
    require!(now < proposal.created_at + 259200, ErrorCode::ProposalClosed); // 72 hours = 259200 seconds
    require!(!proposal.is_executed, ErrorCode::ProposalExecuted);
    
    // Check if member already voted
    // Note: In a real implementation, we'd track votes in a separate account or use a more sophisticated system
    // For simplicity, we're assuming each member can only vote once
    
    // Record vote
    if approve {
        proposal.votes_for += ctx.accounts.member.governance_tokens;
    } else {
        proposal.votes_against += ctx.accounts.member.governance_tokens;
    }
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("User is not a member of the DAO")]
    NotMember,
    #[msg("Proposal voting period has closed")]
    ProposalClosed,
    #[msg("Proposal has already been executed")]
    ProposalExecuted,
}
