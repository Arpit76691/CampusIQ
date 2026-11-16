import React, { useEffect, useState } from 'react';
import { useWS } from '../../context/WSContext';

const LiveRankDrawer = ({ isOpen, onClose, contestId = 1 }) => {
  const { subscribeToLeaderboard, connected } = useWS();
  const [entries, setEntries] = useState([
    { rank: 1, username: 'Arpit Verma', score: 148.0, userId: 3 },
    { rank: 2, username: 'Priya Sharma', score: 120.0, userId: 2 },
    { rank: 3, username: 'Dev Anand', score: 95.0, userId: 1 },
  ]);

  useEffect(() => {
    if (!connected) return;

    const unsubscribe = subscribeToLeaderboard(contestId, (data) => {
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

  if (!isOpen) return null;

  return (
    <div className="live-drawer-backdrop" onClick={onClose}>
      <div className="live-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3>🏆 Live Contest Standings</h3>
            <span className="live-pill">
              <span className="pulse-dot"></span>
              {connected ? 'WebSocket Connected' : 'Connecting to Leaderboard...'}
            </span>
          </div>
          <button className="btn-close-drawer" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-body">
          <table className="drawer-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Participant</th>
                <th style={{ textAlign: 'right' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.userId || entry.username}
                  className={entry.userId === 3 ? 'highlight-row' : ''}
                >
                  <td className="rank-cell">
                    {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                  </td>
                  <td className="user-cell">
                    <span className="user-name">{entry.username}</span>
                    {entry.userId === 3 && <span className="you-pill">You</span>}
                  </td>
                  <td className="score-cell">{entry.score} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveRankDrawer;
