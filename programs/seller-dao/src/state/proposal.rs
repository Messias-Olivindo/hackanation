use anchor_lang::prelude::*;

#[account]
pub struct Proposal {
    pub proposer: Pubkey,
    pub description: String,
    pub target_amount: u64,
    pub recipient: Pubkey,
    pub votes_for: u64,
    pub votes_against: u64,
    pub created_at: i64,
    pub is_executed: bool,
}
