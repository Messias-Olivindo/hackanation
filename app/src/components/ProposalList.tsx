import React from 'react';
import { useDAO } from '../hooks/useDAO';

const ProposalList: React.FC = () => {
  const { proposals, loading, error } = useDAO();

  if (loading) return <div>Loading proposals...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!proposals || proposals.length === 0) return <div>No proposals available</div>;

  return (
    <div className="card">
      <h2>Active Proposals</h2>
      <div className="grid">
        {proposals.map((proposal, index) => (
          <div key={index} className="card">
            <h3>{proposal.description}</h3>
            <p><span className="label">Target Amount:</span> {proposal.targetAmount} USDC</p>
            <p><span className="label">Votes For:</span> {proposal.votesFor}</p>
            <p><span className="label">Votes Against:</span> {proposal.votesAgainst}</p>
            <p><span className="label">Status:</span> {proposal.isExecuted ? 'Executed' : 'Active'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalList;