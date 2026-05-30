use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod seller_dao {
    use super::*;

    pub fn join_dao(ctx: Context<JoinDao>, stake_amount: u64) -> Result<()> {
        Ok(())
    }

    pub fn propose(ctx: Context<Propose>, description: String, target_amount: u64, recipient: Pubkey) -> Result<()> {
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, proposal_id: u64, approve: bool) -> Result<()> {
        Ok(())
    }

    pub fn execute(ctx: Context<Execute>, proposal_id: u64) -> Result<()> {
        Ok(())
    }
}

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

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub member: Account<'info, Member>,
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    pub dao: Account<'info, Dao>,
}

#[derive(Accounts)]
pub struct Execute<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub dao: Account<'info, Dao>,
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
}

#[account]
pub struct Dao {
    pub treasury: Pubkey,
    pub total_members: u64,
}

#[account]
pub struct Member {
    pub user: Pubkey,
    pub stake: u64,
    pub governance_tokens: u64,
    pub sales_volume: u64,
}

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
