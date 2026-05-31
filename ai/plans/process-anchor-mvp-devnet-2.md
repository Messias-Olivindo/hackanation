---
goal: MVP Anchor DAO implementation plan with compile-test-fix loop and devnet deploy
version: 2.0
date_created: 2026-05-31
last_updated: 2026-05-31
owner: SellerDAO team
status: "In Progress — Phases 1-4 Complete, Phase 5 (Devnet deploy) pending"
tags: [process, solana, anchor, testing, devnet, mvp]
---

# Introduction

![Status: In%20progress](https://img.shields.io/badge/status-In%20progress-yellow)

This plan defines a detailed, research-backed implementation workflow for the SellerDAO MVP Anchor program. The workflow enforces a continuous loop: generate code, compile, run tests, fix errors, and if unresolved, validate against external Solana DAO references and official documentation. Scope is limited to the MVP on-chain instructions: `join_dao`, `propose`, `vote`, `execute`.

## 1. Requirements & Constraints

- **REQ-001**: Build with `anchor build` for the MVP program; spl-token-2022 warning may appear.
- **REQ-002**: Provide instruction-level tests for `join_dao`, `propose`, `vote`, `execute`.
- **REQ-003**: Provide a manual test flow and deploy the program to Solana Devnet.
- **REQ-004**: Keep MVP scope limited to on-chain governance and treasury logic only.
- **REQ-005**: Use PDA-based accounts for DAO, treasury, member, and proposal state.
- **CON-001**: No backend integrations, no real payment integrations, and no KYC/AML automation in MVP.
- **CON-002**: Only MoonPay/SmartPay may appear as future references; no other providers.
- **CON-003**: Maintain existing instruction names and signatures in [programs/seller-dao/src/lib.rs](programs/seller-dao/src/lib.rs).
- **GUD-001**: Remove duplicate account definitions and centralize state in [programs/seller-dao/src/state](programs/seller-dao/src/state).
- **GUD-002**: All tests must run on local validator before Devnet deployment.
- **PAT-001**: Use the Anchor program module pattern (`pub fn join_dao(ctx: Context<...>, ...) -> Result<()>`) and instruction modules for logic.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Baseline audit and external reference research.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Audit current MVP files and note discrepancies: [programs/seller-dao/src/lib.rs](programs/seller-dao/src/lib.rs), [programs/seller-dao/src/instructions](programs/seller-dao/src/instructions), [programs/seller-dao/src/state](programs/seller-dao/src/state). Record issues like duplicate account structs and empty handlers. | [x] | 2026-05-31 |
| TASK-002 | Create research notes file [ai/documentation/dao-patterns.md](ai/documentation/dao-patterns.md) summarizing how Solana DAOs structure membership, proposals, votes, and execution. | [x] | 2026-05-31 |
| TASK-003 | Use GitHub search to review DAO patterns: `solana-labs/solana-program-library` (governance), `squads-protocol/squads-mpl`, and `Tribeca` programs. Capture references and design notes in [ai/documentation/dao-patterns.md](ai/documentation/dao-patterns.md). | [x] | 2026-05-31 |
| TASK-004 | Review official docs: Anchor Book, Solana Program Library governance docs, and Solana PDA/Token account docs. Summarize constraints in [ai/documentation/dao-patterns.md](ai/documentation/dao-patterns.md). | [x] | 2026-05-31 |

### Implementation Phase 2

- GOAL-002: Unify program structure and state definitions.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | In [programs/seller-dao/src/lib.rs](programs/seller-dao/src/lib.rs), remove duplicate account structs and use instruction modules for handlers (e.g., `instructions::join_dao::handler`). | [x] | 2026-05-31 |
| TASK-006 | In [programs/seller-dao/src/state/dao.rs](programs/seller-dao/src/state/dao.rs), add PDA seeds documentation and fields required by MVP (e.g., `treasury_bump`, `dao_bump`). | [x] | 2026-05-31 |
| TASK-007 | In [programs/seller-dao/src/state/proposal.rs](programs/seller-dao/src/state/proposal.rs), define `MAX_DESC_LEN` constant and use fixed-size `String` allocation in account space calculations. | [x] | 2026-05-31 |
| TASK-008 | In [programs/seller-dao/src/state/member.rs](programs/seller-dao/src/state/member.rs), keep fields limited to `user`, `stake`, `governance_tokens`, `sales_volume` and document invariants. | [x] | 2026-05-31 |

### Implementation Phase 3

- GOAL-003: Implement instruction logic for MVP with correct accounts and CPI.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-009 | Update [programs/seller-dao/src/instructions/join_dao.rs](programs/seller-dao/src/instructions/join_dao.rs) to use `init_if_needed` for DAO PDA and treasury token account PDA. Validate `stake_amount > 0`, set member fields, and mint governance tokens if applicable. | [x] | 2026-05-31 |
| TASK-010 | Fix CPI transfer in `join_dao`: require SPL token accounts (user token account, treasury token account) and use `token::transfer` with `Token` program, not `system_program`. | [x] | 2026-05-31 |
| TASK-011 | Update [programs/seller-dao/src/instructions/propose.rs](programs/seller-dao/src/instructions/propose.rs) to validate member ownership (`member.user == user.key()`), initialize proposal PDA with deterministic seeds, and store `created_at` using `Clock::get()`. | [x] | 2026-05-31 |
| TASK-012 | Update [programs/seller-dao/src/instructions/vote.rs](programs/seller-dao/src/instructions/vote.rs) to validate member ownership (fix `member.user == user.key()`), enforce a 72h voting window, and prevent double voting via a `VoteRecord` PDA per member and proposal. | [x] | 2026-05-31 |
| TASK-013 | Update [programs/seller-dao/src/instructions/execute.rs](programs/seller-dao/src/instructions/execute.rs) to enforce proposal closed, majority approval, and single execution. Perform token transfer from treasury token account PDA to recipient token account. | [x] | 2026-05-31 |
| TASK-014 | Remove any remaining CRE references from instruction comments or fields (e.g., `sales_volume` updates) to match project constraints. | [x] | 2026-05-31 |

### Implementation Phase 4

- GOAL-004: Implement tests with a compile-test-fix loop.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-015 | Create Anchor tests in [programs/seller-dao/tests/dao_mvp.js](programs/seller-dao/tests/dao_mvp.js) for each instruction: `join_dao`, `propose`, `vote`, `execute`. | [x] | 2026-05-31 |
| TASK-016 | Add a negative test suite in the same file covering: non-member propose, vote after window, execute before close, execute twice. | [x] | 2026-05-31 |
| TASK-017 | Define an iterative loop checklist in [README.md](README.md): build -> test -> fix -> re-test -> if still failing, reference external DAO patterns and docs in [ai/documentation/dao-patterns.md](ai/documentation/dao-patterns.md). | [x] | 2026-05-31 |
| TASK-018 | Run `anchor build` and `anchor test` locally; if failures occur, fix code and re-run until green. Document fixes in [README.md](README.md). | [x] | 2026-05-31 |

### Implementation Phase 5

- GOAL-005: Devnet deployment and manual validation.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-019 | Set `cluster = "devnet"` and stable program ID in [programs/seller-dao/Anchor.toml](programs/seller-dao/Anchor.toml). | | |
| TASK-020 | Deploy with `anchor deploy`, record the program ID and explorer links in [README.md](README.md). | | |
| TASK-021 | Run manual test flow on Devnet: join -> propose -> vote -> execute using funded wallets. Record results and tx links in [README.md](README.md). | | |

## 3. Alternatives

- **ALT-001**: Keep duplicated structs in [programs/seller-dao/src/lib.rs](programs/seller-dao/src/lib.rs). Rejected due to divergence and compile conflicts.
- **ALT-002**: Skip VoteRecord PDA and allow repeated voting. Rejected due to governance integrity risk.
- **ALT-003**: Test only on Devnet. Rejected due to flakiness and slower feedback loops.

## 4. Dependencies

- **DEP-001**: Rust toolchain (stable) and Solana CLI.
- **DEP-002**: Anchor CLI and Node.js for Anchor tests.
- **DEP-003**: SPL Token program for treasury and governance transfers.

## 5. Files

- **FILE-001**: [programs/seller-dao/src/lib.rs](programs/seller-dao/src/lib.rs)
- **FILE-002**: [programs/seller-dao/src/instructions/join_dao.rs](programs/seller-dao/src/instructions/join_dao.rs)
- **FILE-003**: [programs/seller-dao/src/instructions/propose.rs](programs/seller-dao/src/instructions/propose.rs)
- **FILE-004**: [programs/seller-dao/src/instructions/vote.rs](programs/seller-dao/src/instructions/vote.rs)
- **FILE-005**: [programs/seller-dao/src/instructions/execute.rs](programs/seller-dao/src/instructions/execute.rs)
- **FILE-006**: [programs/seller-dao/src/state/dao.rs](programs/seller-dao/src/state/dao.rs)
- **FILE-007**: [programs/seller-dao/src/state/member.rs](programs/seller-dao/src/state/member.rs)
- **FILE-008**: [programs/seller-dao/src/state/proposal.rs](programs/seller-dao/src/state/proposal.rs)
- **FILE-009**: [programs/seller-dao/Anchor.toml](programs/seller-dao/Anchor.toml)
- **FILE-010**: [programs/seller-dao/tests/dao_mvp.ts](programs/seller-dao/tests/dao_mvp.ts)
- **FILE-011**: [README.md](README.md)
- **FILE-012**: [ai/documentation/dao-patterns.md](ai/documentation/dao-patterns.md)

## 6. Testing

- **TEST-001**: `anchor test` covering instruction-level and negative tests.
- **TEST-002**: Local validator integration flow for join -> propose -> vote -> execute.
- **TEST-003**: Devnet manual test flow with recorded tx links.

## 7. Risks & Assumptions

- **RISK-001**: PDA account sizing for `String` fields can cause account allocation failures if not fixed with max length.
- **RISK-002**: Token CPI calls will fail if associated token accounts are not properly created for treasury and recipients.
- **RISK-003**: Devnet airdrop limits can slow down manual tests.
- **ASSUMPTION-001**: MVP contract remains limited to the four instructions.
- **ASSUMPTION-002**: Payment flows remain simulated and do not require provider credentials.

## 8. Related Specifications / Further Reading

- [ai/documentation/project-context.md](ai/documentation/project-context.md)
- [ai/specs/project-specs.md](ai/specs/project-specs.md)
- https://book.anchor-lang.com/
- https://docs.solana.com/
- https://docs.solana.com/developing/programming-model/calling-between-programs
- https://docs.solana.com/developing/programming-model/runtime
