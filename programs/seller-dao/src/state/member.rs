use anchor_lang::prelude::*;

#[account]
pub struct Member {
    pub user: Pubkey,
    pub stake: u64,
    pub governance_tokens: u64,
    pub sales_volume: u64,
}
