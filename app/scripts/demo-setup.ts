import { Connection, Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

// Set up the connection to Solana devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Create 5 test wallets for simulation
async function createTestWallets() {
  const wallets = [];
  for (let i = 0; i < 5; i++) {
    const wallet = Keypair.generate();
    wallets.push(wallet);
    
    // Airdrop SOL to each wallet
    const signature = await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL * 2);
    await connection.confirmTransaction(signature);
    
    console.log(`Created wallet ${i + 1}: ${wallet.publicKey.toBase58()}`);
  }
  
  return wallets;
}

// Create a proposal for shipping contract with Jadlog
async function createInitialProposal(wallets: any[]) {
  // In a real implementation, this would call the join_dao and propose instructions
  // For the demo, we'll just simulate the proposal creation
  
  const proposer = wallets[0];
  const targetAmount = 50000000; // 50 USDC
  const recipient = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'); // Program ID
  
  console.log(`Created initial proposal for ${targetAmount} USDC to ${recipient.toBase58()}`);
  console.log('Proposal is now active and ready for voting');
}

// Main function
async function main() {
  console.log('Setting up demo environment for SellerDAO...');
  
  // Create test wallets
  const wallets = await createTestWallets();
  
  // Create initial proposal
  await createInitialProposal(wallets);
  
  console.log('Demo setup complete!');
  console.log('Run "npm run demo:vote" to simulate voting');
}

main().catch(console.error);