use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use crate::state::{Dao, Member, Proposal};

#[derive(Accounts)]
pub struct Propose<'info> {
    #[account(mut)]
    pub member: Account<'info, Member>,
    #[account(init, payer = member, space = 8 + 32 + 8 + 32 + 32 + 8 + 8 + 1)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub dao: Account<'info, Dao>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn propose(ctx: Context<Propose>, description: String, target_amount: u64, recipient: Pubkey) -> Result<()> {
    // Validate that the user is a member
    require!(ctx.accounts.member.user == *ctx.accounts.user.key, ErrorCode::NotMember);
    
    // Create proposal
    let proposal = &mut ctx.accounts.proposal;
    proposal.proposer = *ctx.accounts.member.key;
    proposal.description = description;
    proposal.target_amount = target_amount;
    proposal.recipient = recipient;
    proposal.votes_for = 0;
    proposal.votes_against = 0;
    proposal.created_at = Clock::get()?.unix_timestamp;
    proposal.is_executed = false;
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("User is not a member of the DAO")]
    NotMember,
}
