import React from 'react';
import { useDAO } from '../hooks/useDAO';

const History: React.FC = () => {
  const { proposals, loading, error } = useDAO();

  if (loading) return <div>Loading history...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!proposals || proposals.length === 0) return <div>No history available</div>;

  const executedProposals = proposals.filter(p => p.isExecuted);
  const inactiveProposals = proposals.filter(p => !p.isExecuted);

  return (
    <div className="card">
      <h2>Execution History</h2>
      
      {executedProposals.length > 0 && (
        <>
          <h3>Executed Proposals</h3>
          <div className="grid">
            {executedProposals.map((proposal, index) => (
              <div key={index} className="card">
                <h4>{proposal.description}</h4>
                <p><span className="label">Amount:</span> {proposal.targetAmount} USDC</p>
                <p><span className="label">Recipient:</span> {proposal.recipient}</p>
                <p className="success">✓ Executed</p>
              </div>
            ))}
          </div>
        </>
      )}
      
      {inactiveProposals.length > 0 && (
        <>
          <h3>Active Proposals</h3>
          <div className="grid">
            {inactiveProposals.map((proposal, index) => (
              <div key={index} className="card">
                <h4>{proposal.description}</h4>
                <p><span className="label">Amount:</span> {proposal.targetAmount} USDC</p>
                <p><span className="label">Votes For:</span> {proposal.votesFor}</p>
                <p><span className="label">Votes Against:</span> {proposal.votesAgainst}</p>
                <p className="label">Status: Active</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default History;