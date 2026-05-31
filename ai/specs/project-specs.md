# SellerDAO - Project Specifications

## Overview

| Property   | Value                                                   |
| ---------- | ------------------------------------------------------- |
| Project    | SellerDAO                                               |
| Hackathon  | Hackanation 2026                                        |
| Track      | Payments, RWAs & Tokenization                           |
| Target     | Marketplace sellers                                     |
| Core Value | Collective bargaining power outside marketplace control |

## Functional Requirements

### Core Features

1. **DAO Membership**
   - Stake 10 USDC to join
   - Receive governance tokens proportional to sales volume
   - Maximum concentration limit implemented

2. **Treasury Management**
   - 1-2% of each sale automatically contributes to treasury
   - Treasury controlled by PDA
   - Transparent on Solana Explorer

3. **Proposal System**
   - Any member can propose treasury usage
   - Proposal types: collective inventory buys, creator pool revenue splits, media buys
   - 72-hour voting window
   - Majority vote required for approval

4. **Execution System**
   - Approved proposals execute automatically
   - Funds transferred directly to recipient
   - Benefits distributed proportional to sales volume or proposal rules

### Technical Requirements

- On-chain: Anchor (Rust) program with 4 instructions
- Frontend: Next.js + TypeScript
- UI: TailwindCSS with component library for minimal, data-focused screens
- Web3: @solana/web3.js + @solana/wallet-adapter-react
- Wallet: Phantom integration
- Storage: PDAs for all state data
- Tokens: SPL Token for governance
- On-ramp: provider to validate; no assumption of PIX -> USDC on Solana in MVP
- Tailwind setup: tailwindcss + postcss + autoprefixer with config files

## Non-Functional Requirements

### Performance

- Transaction confirmation time < 5 seconds on Devnet
- Frontend load time < 2 seconds
- Support for 100+ concurrent users

### Security

- All state data stored on-chain
- No sensitive data stored off-chain
- All transactions verifiable on Solana Explorer
- No private keys stored in frontend

### Usability

- Intuitive UI for non-technical sellers
- Clear visual indicators for proposal status
- Mobile-responsive design
- English and Portuguese support

## Constraints

- Must work on Solana Devnet for demo
- No external bridges or oracles (pure Solana)
- Must be deployable with Anchor framework
- Must use Phantom wallet connection
- Must be ready for Hackanation 2026 submission by May 31, 2026
- No backend services in MVP; payment on-ramp is UI simulation only

## Integration Notes (On-ramp providers to validate)

- Only validate MoonPay for PIX -> USDC on Solana and SmartPay for USDC -> PIX

## Future Architecture (Post-Hackathon)

- Backend: NestJS + PostgreSQL + Prisma for marketplace API ingestion
- Async processing: queue worker (e.g., BullMQ/Redis) for sales reconciliation
- Compliance: KYC/AML and secure storage for provider credentials
