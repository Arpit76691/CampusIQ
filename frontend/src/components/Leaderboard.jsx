import React, { useEffect, useState } from 'react';
import { useWS } from '../context/WSContext';

// Leaderboard entry shape from backend:
// { rank: number, username: string, score: number, userId: number }

const Leaderboard = ({ contestId = 1 }) => {
  const { subscribeToLeaderboard, connected } = useWS();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!connected) return;

    // Subscribe to real-time leaderboard updates via STOMP /topic/leaderboard/{contestId}
    const unsubscribe = subscribeToLeaderboard(contestId, (data) => {
      // Backend sends LeaderboardUpdate { contestId, entries: [...] }
      if (data && Array.isArray(data.entries)) {
        setEntries(data.entries);
      } else if (Array.isArray(data)) {
        setEntries(data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [connected, contestId, subscribeToLeaderboard]);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>Live Leaderboard {connected && <span style={{ fontSize: 12, color: '#10b981' }}>● Live</span>}</h2>
      {entries.length === 0 ? (
        <p style={{ color: '#888', fontSize: 14 }}>
          {connected ? 'Waiting for leaderboard updates...' : 'Connecting to live leaderboard...'}
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px' }}>Rank</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>User</th>
              <th style={{ textAlign: 'right', padding: '8px' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.userId || e.username} style={{ borderTop: '1px solid #333' }}>
                <td style={{ padding: '8px' }}>#{e.rank}</td>
                <td style={{ padding: '8px' }}>{e.username}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{e.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
