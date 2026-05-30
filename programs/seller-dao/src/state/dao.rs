use anchor_lang::prelude::*;

#[account]
pub struct Dao {
    pub treasury: Pubkey,
    pub total_members: u64,
}
