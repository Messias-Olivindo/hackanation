# Solana DAO Patterns (Research Notes)

## Sources

- https://www.anchor-lang.com/docs
- https://www.anchor-lang.com/docs/basics/program-structure
- https://solana.com/docs/core/accounts
- https://solana.com/docs/core/transactions
- https://github.com/solana-labs/solana-program-library/tree/main/governance
- https://docs.squads.so/main

## Patterns Observed

- Anchor program structure uses `#[program]` for instruction handlers and `#[derive(Accounts)]` for account validation. Account sizing must include the 8-byte discriminator and all fields.
- PDA-based accounts are the common pattern for DAO state: DAO config, proposal accounts, and vote records use deterministic seeds to prevent duplicates and to make lookups deterministic.
- Governance in SPL Governance uses proposal accounts with explicit state transitions, vote records keyed by proposal + voter, and execution logic that checks proposal state before executing instructions.
- Vote records are separate accounts to prevent double voting and to preserve auditability of each vote. The SPL Governance program uses a vote record PDA derived from proposal and voter.
- Execution logic validates proposal state and uses a PDA as signer to authorize transfers or instructions. This avoids single-key custody and matches the multisig/trustless pattern.
- Solana account model enforces ownership rules: only the owning program can mutate data. All state transitions should be explicit and validated.
- Transactions are atomic on Solana; if any instruction in a transaction fails, all state changes are rolled back. This influences test design for proposal execution.

## MVP Implications for SellerDAO

- Use PDA seeds for DAO, treasury token account, proposal, and vote record to ensure deterministic addressing.
- Use a vote record account per member and proposal to prevent double voting and enable auditability.
- Keep proposal state minimal for MVP: created time, votes for/against, executed flag.
- Use SPL Token transfers for treasury movement; system program transfers are not valid for USDC.
- Enforce voting window based on `Clock::get()?.unix_timestamp`.

## Notes on Multisig

- Squads is a widely used multisig pattern for securing treasuries and enforcing M-of-N approvals. It is appropriate for production, but the MVP can model treasury custody as a program-owned PDA and keep multisig as a documented future enhancement.
