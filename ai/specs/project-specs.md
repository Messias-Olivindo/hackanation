# SellerDAO - Project Specifications

## Overview

| Property | Value |
|----------|-------|
| Project | SellerDAO |
| Hackathon | Hackanation 2026 |
| Track | Payments, RWAs & Tokenization |
| Target | Marketplace sellers |
| Core Value | Collective bargaining power |

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
   - Proposal types: shipping contracts, media buys, influencer deals
   - 72-hour voting window
   - Majority vote required for approval

4. **Execution System**
   - Approved proposals execute automatically
   - Funds transferred directly to recipient
   - Benefits distributed proportional to sales volume

### Technical Requirements
- On-chain: Anchor (Rust) program with 4 instructions
- Frontend: React with @solana/web3.js
- Wallet: Phantom integration
- Storage: PDAs for all state data
- Tokens: SPL Token for governance

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