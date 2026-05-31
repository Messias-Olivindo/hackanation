---
goal: MVP test, build, and devnet deploy plan for SellerDAO
version: 1.0
date_created: 2026-05-31
last_updated: 2026-05-31
owner: SellerDAO team
status: "In Progress — Phases 1-4 Complete, Phase 5 (Devnet deploy) pending"
tags: [process, testing, deployment, solana, anchor, mvp]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan defines an MVP-focused implementation workflow for SellerDAO that guarantees compilation, covers individual tests, defines manual test flows, and documents devnet deployment for the Anchor program and the demo frontend. Scope is limited to the four on-chain instructions (`join_dao`, `propose`, `vote`, `execute`) with simulated off-chain flows, as required by the hackathon MVP.

## 1. Requirements & Constraints

- **REQ-001**: Compile the Anchor program with `anchor build` without warnings that block deployment.
- **REQ-002**: Provide individual tests for each instruction (`join_dao`, `propose`, `vote`, `execute`).
- **REQ-003**: Provide manual test scripts for the full MVP flow on Devnet.
- **REQ-004**: Deploy the program to Solana Devnet with a deterministic program ID recorded for the demo.
- **REQ-005**: Frontend must connect to Devnet and display treasury state, proposals, and votes.
- **CON-001**: MVP scope excludes backend integrations, KYC/AML automation, and real payment processing.
- **CON-002**: Only MoonPay/SmartPay are referenced as future payment providers; no other providers appear in plan deliverables.
- **CON-003**: The demo uses simulated off-chain data (manual/CSV).
- **GUD-001**: Keep all on-chain logic inside the Anchor program; do not add new on-chain features beyond the four instructions.
- **GUD-002**: Test cases must be deterministic and repeatable on local validator before Devnet.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Establish a reproducible local build and test environment for the Anchor program.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Confirm toolchain versions: Rust stable, Solana CLI, and Anchor CLI used by the repo. Record versions in [README.md](README.md). | [x] | 2026-05-31 |
| TASK-002 | Run `anchor build` for programs/seller-dao and resolve any compile errors or warnings that fail build. | [x] | 2026-05-31 |
| TASK-003 | Configure `Anchor.toml` to target `devnet` and ensure the program ID is committed for reproducible deploys. | [x] | 2026-05-31 |

### Implementation Phase 2

- GOAL-002: Implement instruction-level tests for the four MVP instructions.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004 | Create unit test for `join_dao` verifying: stake transfer, member account creation, governance token mint, and concentration limit enforcement. | [x] | 2026-05-31 |
| TASK-005 | Create unit test for `propose` verifying: proposal account creation, metadata fields, voting window, and treasury target. | [x] | 2026-05-31 |
| TASK-006 | Create unit test for `vote` verifying: vote weight, duplicate-vote prevention, and proposal state update. | [x] | 2026-05-31 |
| TASK-007 | Create unit test for `execute` verifying: approval conditions, treasury transfer, and execution idempotency. | [x] | 2026-05-31 |

### Implementation Phase 3

- GOAL-003: Add integration tests for end-to-end governance flow on local validator.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-008 | Build an integration test that runs `join_dao` → `propose` → `vote` → `execute` with two or more members and validates token balances and treasury changes. | [x] | 2026-05-31 |
| TASK-009 | Add negative tests: proposal rejected due to insufficient votes; execute before voting window end; invalid proposer; invalid target. | [x] | 2026-05-31 |

### Implementation Phase 4

- GOAL-004: Define manual test scripts for demo and QA verification.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-010 | Write manual test steps for MVP flow on Devnet: join, propose, vote, execute, verify on Solana Explorer. | [x] | 2026-05-31 |
| TASK-011 | Define manual wallet setup: airdrops, seed wallets, and expected balances for demo accounts. | [x] | 2026-05-31 |
| TASK-012 | Document frontend validation checklist: wallet connect, proposal list, vote updates, treasury balance refresh. | [x] | 2026-05-31 |

### Implementation Phase 5

- GOAL-005: Deploy to Devnet and validate the demo flow.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-013 | Deploy program to Devnet with `anchor deploy` and record program ID in [README.md](README.md) and [app/src](app/src) config if applicable. | | |
| TASK-014 | Seed Devnet test accounts and run the full flow using scripts under [app/scripts](app/scripts). | | |
| TASK-015 | Validate on-chain state with Solana Explorer links saved in [README.md](README.md). | | |

## 3. Alternatives

- **ALT-001**: Use a single monolithic integration test only. Rejected because it hides instruction-level regressions.
- **ALT-002**: Skip local validator tests and test only on Devnet. Rejected due to flakiness and slower feedback.

## 4. Dependencies

- **DEP-001**: Rust toolchain (stable) for compiling the Anchor program.
- **DEP-002**: Solana CLI for keypair management, airdrops, and Devnet deployment.
- **DEP-003**: Anchor CLI for build, test, and deploy workflows.
- **DEP-004**: Node.js dependencies for frontend and scripts in [app/scripts](app/scripts).

## 5. Files

- **FILE-001**: [programs/seller-dao/Anchor.toml](programs/seller-dao/Anchor.toml) for cluster configuration and program ID.
- **FILE-002**: [programs/seller-dao/src/lib.rs](programs/seller-dao/src/lib.rs) for instruction definitions.
- **FILE-003**: [programs/seller-dao/src/instructions/join_dao.rs](programs/seller-dao/src/instructions/join_dao.rs)
- **FILE-004**: [programs/seller-dao/src/instructions/propose.rs](programs/seller-dao/src/instructions/propose.rs)
- **FILE-005**: [programs/seller-dao/src/instructions/vote.rs](programs/seller-dao/src/instructions/vote.rs)
- **FILE-006**: [programs/seller-dao/src/instructions/execute.rs](programs/seller-dao/src/instructions/execute.rs)
- **FILE-007**: [app/scripts](app/scripts) for demo setup and voting scripts.
- **FILE-008**: [README.md](README.md) for recording versions, program ID, and Devnet links.

## 6. Testing

- **TEST-001**: `anchor test` for instruction-level tests covering `join_dao`, `propose`, `vote`, `execute`.
- **TEST-002**: Integration test for the end-to-end governance flow on local validator.
- **TEST-003**: Manual Devnet test run using seeded wallets and recorded Explorer links.

## 7. Risks & Assumptions

- **RISK-001**: Devnet airdrops can be rate-limited, delaying tests.
- **RISK-002**: Changes to Solana/Anchor versions could break deterministic builds.
- **ASSUMPTION-001**: The MVP contract only implements the four instructions and no backend integrations.
- **ASSUMPTION-002**: Payment flows remain simulated in the MVP and do not require real provider credentials.

## 8. Related Specifications / Further Reading

- [ai/documentation/project-context.md](ai/documentation/project-context.md)
- [ai/specs/project-specs.md](ai/specs/project-specs.md)
- https://book.anchor-lang.com/
- https://docs.solana.com/
