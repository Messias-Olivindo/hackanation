import React from 'react';
import { useDAO } from '../hooks/useDAO';

const Treasury: React.FC = () => {
  const { dao, loading, error } = useDAO();

  if (loading) return <div>Loading treasury data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!dao) return <div>No DAO data available</div>;

  return (
    <div className="card">
      <h2>Treasury</h2>
      <p className="label">Current Balance</p>
      <p className="value">{dao.treasury}</p>
      <p className="label">Total Members</p>
      <p className="value">{dao.totalMembers}</p>
    </div>
  );
};

export default Treasury;