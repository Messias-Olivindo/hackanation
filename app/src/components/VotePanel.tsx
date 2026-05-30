import React, { useState } from 'react';
import { useDAO } from '../hooks/useDAO';
import { useWallet } from '../hooks/useWallet';

const VotePanel: React.FC = () => {
  const { proposals, loading, error } = useDAO();
  const { connected, publicKey, connect } = useWallet();
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [voteChoice, setVoteChoice] = useState<'for' | 'against' | null>(null);
  const [voting, setVoting] = useState(false);

  if (loading) return <div>Loading vote panel...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!proposals || proposals.length === 0) return <div>No proposals available to vote on</div>;

  const handleVote = async () => {
    if (!selectedProposal || !voteChoice || !connected) return;
    
    setVoting(true);
    // In a real implementation, this would call the Solana program's vote instruction
    // For now, we'll just simulate
    setTimeout(() => {
      setVoting(false);
      alert(`Vote recorded: ${voteChoice} on proposal ${selectedProposal}`);
      setSelectedProposal(null);
      setVoteChoice(null);
    }, 1000);
  };

  return (
    <div className="card">
      <h2>Vote on Proposals</h2>
      
      {!connected ? (
        <button className="button" onClick={connect}>Connect Wallet to Vote</button>
      ) : (
        <>
          <div>
            <label>
              Select Proposal:
              <select 
                value={selectedProposal || ''} 
                onChange={(e) => setSelectedProposal(parseInt(e.target.value))}
              >
                <option value="">-- Select a proposal --</option>
                {proposals.map((proposal, index) => (
                  <option key={index} value={index}>{proposal.description}</option>
                ))}
              </select>
            </label>
          </div>
          
          <div>
            <label>
              Vote:
              <div>
                <label>
                  <input 
                    type="radio" 
                    name="vote" 
                    value="for" 
                    checked={voteChoice === 'for'}
                    onChange={() => setVoteChoice('for')}
                  />
                  For
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="vote" 
                    value="against" 
                    checked={voteChoice === 'against'}
                    onChange={() => setVoteChoice('against')}
                  />
                  Against
                </label>
              </div>
            </label>
          </div>
          
          <button 
            className="button" 
            onClick={handleVote}
            disabled={!selectedProposal || !voteChoice || voting}
          >
            {voting ? 'Voting...' : 'Cast Vote'}
          </button>
        </>
      )}
    </div>
  );
};

export default VotePanel;