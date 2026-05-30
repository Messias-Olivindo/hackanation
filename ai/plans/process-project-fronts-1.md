---
goal: Development plan for SellerDAO project fronts
version: 1.0
date_created: 2026-05-30
last_updated: 2026-05-30
owner: SellerDAO Team
status: 'Planned'
tags: [process, architecture, feature]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan defines the development workflow for the on-chain program, frontend app, demo scripts, and documentation to deliver the SellerDAO hackathon submission.

## 1. Requirements & Constraints

- **REQ-001**: Implement 4 core instructions: `join_dao`, `propose`, `vote`, `execute`.
- **REQ-002**: Use Solana Devnet for demo and testing.
- **REQ-003**: Use Phantom wallet for frontend connection.
- **REQ-004**: Follow Solana skills guidance for program security checks and testing strategy.
- **SEC-001**: No private keys stored in frontend or repo.
- **SEC-002**: All critical state stored on-chain in PDA accounts.
- **CON-001**: No external oracles or CRE integrations in the hackathon scope.
- **CON-002**: Must be deployable with Anchor on Solana Devnet.
- **GUD-001**: Keep documentation aligned with implementation.
- **GUD-002**: Apply the Solana security checklist and testing pyramid to on-chain changes.
- **PAT-001**: PDA seeds must be deterministic and documented.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Implement the core Anchor program with verified state transitions.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Define PDA seeds and account structs in programs/seller-dao/src/state/dao.rs, programs/seller-dao/src/state/member.rs, programs/seller-dao/src/state/proposal.rs (include sizes and constraints). | | |
| TASK-002 | Implement `join_dao` in programs/seller-dao/src/instructions/join_dao.rs with treasury PDA, member init, and SPL token transfer via token program and ATAs. | | |
| TASK-003 | Implement `propose` in programs/seller-dao/src/instructions/propose.rs with signer validation, proposal init, and timestamps. | | |
| TASK-004 | Implement `vote` in programs/seller-dao/src/instructions/vote.rs with signer validation, vote window check, and one-vote-per-member tracking (new VoteRecord PDA). | | |
| TASK-005 | Implement `execute` in programs/seller-dao/src/instructions/execute.rs with majority check and treasury transfer to recipient ATA. | | |
| TASK-006 | Wire instruction modules and error types in programs/seller-dao/src/lib.rs. | | |
| TASK-007 | Review each instruction against the Solana security checklist (signer checks, account constraints, PDA ownership) and document any required fixes. | | |

### Implementation Phase 2

- GOAL-002: Build the frontend dashboard and wallet flow.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-008 | Update app/pages/index.tsx to render Treasury, ProposalList, VotePanel, and History components with layout container. | | |
| TASK-009 | Replace mock data in app/src/hooks/useDAO.ts with real on-chain reads using program IDs and PDAs. | | |
| TASK-010 | Improve wallet UX in app/src/hooks/useWallet.ts and add connect/disconnect states in VotePanel. | | |
| TASK-011 | Align treasury balance display in app/src/components/Treasury.tsx with real token account balance. | | |
| TASK-012 | Add error/loading states in app/src/components/ProposalList.tsx and app/src/components/History.tsx for empty data. | | |

### Implementation Phase 3

- GOAL-003: Prepare demo scripts and environment setup.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-013 | Update app/scripts/demo-setup.ts to create members via `join_dao` and create an initial proposal using real instructions. | | |
| TASK-014 | Update app/scripts/demo-vote.ts to cast votes via `vote` and optionally call `execute`. | | |
| TASK-015 | Add required dependencies in app/package.json (e.g., @project-serum/anchor, @solana/spl-token) and keep versions pinned. | | |
| TASK-016 | Document demo commands in README.md and ai/documentation/project-context.md. | | |

### Implementation Phase 4

- GOAL-004: Finalize documentation and QA for submission.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-017 | Update ai/specs/project-specs.md to reflect final on-chain and frontend behavior. | | |
| TASK-018 | Update ai/versions/version-history.md with the actual release notes for v1.0.0. | | |
| TASK-019 | Verify README.md includes setup, deploy, and demo steps with Devnet instructions. | | |

## 3. Alternatives

- **ALT-001**: Use off-chain data validation for sales volume; rejected due to CON-001 (no external oracles/CRE).
- **ALT-002**: Centralized backend for proposal data; rejected to keep on-chain source of truth.

## 4. Dependencies

- **DEP-001**: Solana CLI (stable) for deployment and Devnet configuration.
- **DEP-002**: Anchor CLI and Rust toolchain for program build.
- **DEP-003**: Node.js 18+ for frontend and scripts.
- **DEP-004**: Phantom wallet for browser-based testing.

## 5. Files

- **FILE-001**: programs/seller-dao/src/lib.rs
- **FILE-002**: programs/seller-dao/src/instructions/join_dao.rs
- **FILE-003**: programs/seller-dao/src/instructions/propose.rs
- **FILE-004**: programs/seller-dao/src/instructions/vote.rs
- **FILE-005**: programs/seller-dao/src/instructions/execute.rs
- **FILE-006**: programs/seller-dao/src/state/dao.rs
- **FILE-007**: programs/seller-dao/src/state/member.rs
- **FILE-008**: programs/seller-dao/src/state/proposal.rs
- **FILE-009**: app/pages/index.tsx
- **FILE-010**: app/src/hooks/useDAO.ts
- **FILE-011**: app/src/hooks/useWallet.ts
- **FILE-012**: app/src/components/Treasury.tsx
- **FILE-013**: app/src/components/ProposalList.tsx
- **FILE-014**: app/src/components/VotePanel.tsx
- **FILE-015**: app/src/components/History.tsx
- **FILE-016**: app/scripts/demo-setup.ts
- **FILE-017**: app/scripts/demo-vote.ts
- **FILE-018**: README.md
- **FILE-019**: ai/documentation/project-context.md
- **FILE-020**: ai/specs/project-specs.md
- **FILE-021**: ai/versions/version-history.md

## 6. Testing

- **TEST-001**: Add Anchor tests for `join_dao`, `propose`, `vote`, `execute` using a local validator.
- **TEST-002**: Add LiteSVM unit tests for account constraints and PDA derivations.
- **TEST-003**: Add Mollusk instruction tests for `join_dao` and `vote` edge cases.
- **TEST-004**: Use Surfpool for end-to-end Devnet-like integration tests.
- **TEST-005**: Manual UI test for wallet connect, proposal list, vote flow, and history view on Devnet.

## 7. Risks & Assumptions

- **RISK-001**: Devnet instability may affect demo transactions.
- **RISK-002**: Token account setup errors can block treasury transfers.
- **ASSUMPTION-001**: Phantom wallet is available on demo machines.
- **ASSUMPTION-002**: All sellers use Devnet test wallets for the demo.

## 8. Related Specifications / Further Reading

- ai/specs/project-specs.md
- ai/documentation/hackathon-details.md
- README.md
