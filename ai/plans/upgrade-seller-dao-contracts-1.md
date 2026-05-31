---
goal: Harden SellerDAO governance checks and clean build warnings
version: 1.0
date_created: 2026-05-31
last_updated: 2026-05-31
owner: core-team
status: In progress
tags: [upgrade, bug, governance, build, docs]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Plan to harden on-chain governance checks, address the spl-token-2022 build stack warning, and update docs to reflect the current behavior.

## 1. Requirements & Constraints

- **REQ-001**: Keep current instruction API compatible for MVP flows.
- **REQ-002**: Add recipient validation during execute.
- **REQ-003**: Enforce non-zero proposal target amounts.
- **REQ-004**: Document build warnings and mitigations in ai/.
- **SEC-001**: Prevent execution to arbitrary recipient token accounts.
- **CON-001**: Do not change existing PDA seeds in-place for current MVP unless a migration plan exists.
- **GUD-001**: Prefer minimal changes that do not require account realloc during hackathon.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Add missing governance validations without breaking account layouts.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Add execute constraint to enforce `recipient_token_account.key() == proposal.recipient` in programs/seller-dao/src/dao_accounts.rs. | ✅ | 2026-05-31 |
| TASK-002 | Add `target_amount > 0` validation in programs/seller-dao/src/instructions/propose.rs. | ✅ | 2026-05-31 |
| TASK-003 | Add test case for invalid recipient in programs/seller-dao/tests/dao_mvp.js. | ✅ | 2026-05-31 |
| TASK-004 | Add test case for zero target amount in programs/seller-dao/tests/dao_mvp.js. | ✅ | 2026-05-31 |

### Implementation Phase 2

- GOAL-002: Stabilize build by aligning toolchain versions and documenting results.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Verify Solana/Anchor versions with `solana --version` and `anchor --version`, update docs in ai/documentation/smart-contracts-guide.md. | ✅ | 2026-05-31 |
| TASK-006 | Run `cargo update`, restrict anchor-spl features to token/associated_token, and test `anchor build` to confirm spl-token-2022 stack warning status. | ✅ | 2026-05-31 |
| TASK-007 | If warnings persist, pin `solana-program` version in programs/seller-dao/Cargo.toml and re-test. Patch to the same source is invalid; requires a different source or upstream fix. Warning persists after feature restriction. | ⚠️ | 2026-05-31 |

### Implementation Phase 3

- GOAL-003: Optional governance state hardening with a DAO v2.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-008 | Define DaoV2 and MemberV2 accounts to store `dao` and `mint` references; add new PDA seeds to avoid realloc. | | |
| TASK-009 | Add migration path or re-init script for devnet/testnet. | | |
| TASK-010 | Update docs in ai/ to describe the v2 state model. | | |

## 3. Alternatives

- **ALT-001**: Use SPL Governance/Realms for proposals and vote records; not chosen due to integration scope for MVP.
- **ALT-002**: Use Squads for proposals and execution; not chosen because on-chain voting is already implemented in-program.

## 4. Dependencies

- **DEP-001**: anchor-lang 0.29.0
- **DEP-002**: anchor-spl 0.29.0
- **DEP-003**: Solana CLI compatible with Anchor 0.29.0

## 5. Files

- **FILE-001**: programs/seller-dao/src/dao_accounts.rs
- **FILE-002**: programs/seller-dao/src/instructions/propose.rs
- **FILE-003**: programs/seller-dao/tests/dao_mvp.js
- **FILE-004**: programs/seller-dao/Cargo.toml
- **FILE-005**: ai/documentation/smart-contracts-guide.md

## 6. Testing

- **TEST-001**: `anchor test` passes with new negative tests for zero target and invalid recipient.
- **TEST-002**: `anchor build` is clean or documented with accepted warnings.

## 7. Risks & Assumptions

- **RISK-001**: Adding v2 accounts changes PDA seeds and requires new deployment.
- **RISK-002**: spl-token-2022 stack warnings may persist due to upstream toolchain behavior.
- **ASSUMPTION-001**: MVP does not require on-chain migration of existing devnet state.

## 8. Related Specifications / Further Reading

- https://github.com/solana-labs/solana-program-library/tree/master/governance
- https://docs.squads.so/main
- https://book.anchor-lang.com/
