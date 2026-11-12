import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const AVATAR_COLORS = ['#6c63ff','#a855f7','#10b981','#3b82f6','#f59e0b','#ef4444'];
const colorFor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const SIDEBAR_ITEMS = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'contests', icon: '🏆', label: 'Contests', badge: '3' },
  { id: 'problems', icon: '💻', label: 'Problem Bank' },
  { id: 'leaderboard', icon: '📊', label: 'Leaderboard' },
  { id: 'skills', icon: '🎯', label: 'Skill Tracker' },
  { id: 'analytics', icon: '📈', label: 'Analytics' },
  { id: 'submissions', icon: '📝', label: 'Submissions' },
  { id: 'notifications', icon: '🔔', label: 'Notifications', badge: '5' },
];

const CONTESTS = [
  { id: 1, name: 'DSA Sprint — Round 7', subject: 'DSA', difficulty: 'Hard', participants: 342, time: 'Live Now', status: 'live' },
  { id: 2, name: 'DBMS Fundamentals Quiz', subject: 'DBMS', difficulty: 'Medium', participants: 215, time: 'Tomorrow 10:00 AM', status: 'upcoming' },
  { id: 3, name: 'CN Protocol Challenge', subject: 'CN', difficulty: 'Hard', participants: 178, time: 'Nov 6, 2:00 PM', status: 'upcoming' },
  { id: 4, name: 'Cloud Basics Contest', subject: 'CC', difficulty: 'Easy', participants: 290, time: 'Ended', status: 'ended' },
  { id: 5, name: 'FSD React Challenge', subject: 'FSD', difficulty: 'Medium', participants: 410, time: 'Ended', status: 'ended' },
];

const LEADERBOARD = [
  { rank: 1, name: 'Arpit Verma', batch: 'CSE-A 2025', score: 4820, trend: 'up' },
  { rank: 2, name: 'Priya Sharma', batch: 'CSE-B 2025', score: 4750, trend: 'up' },
  { rank: 3, name: 'Rahul Singh', batch: 'CSE-A 2025', score: 4680, trend: 'down' },
  { rank: 4, name: 'Sneha Patel', batch: 'CSE-C 2025', score: 4540, trend: 'up' },
  { rank: 5, name: 'Dev Anand', batch: 'CSE-B 2025', score: 4390, trend: 'down' },
];

const SKILLS = [
  { id: 'dsa', icon: '🔗', label: 'DSA', color: '#6c63ff', bg: 'rgba(108,99,255,0.15)', solved: 134, total: 200, pct: 67 },
  { id: 'dbms', icon: '🗄️', label: 'DBMS', color: '#10b981', bg: 'rgba(16,185,129,0.15)', solved: 78, total: 120, pct: 65 },
  { id: 'cn', icon: '🌐', label: 'Computer Networks', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', solved: 52, total: 100, pct: 52 },
  { id: 'cc', icon: '☁️', label: 'Cloud Computing', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', solved: 40, total: 90, pct: 44 },
  { id: 'fsd', icon: '🖥️', label: 'Full Stack Dev', color: '#a855f7', bg: 'rgba(168,85,247,0.15)', solved: 95, total: 150, pct: 63 },
  { id: 'os', icon: '⚙️', label: 'OS Concepts', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', solved: 61, total: 110, pct: 55 },
];

const ACTIVITY = [
  { type: 'green', text: <><strong>You</strong> solved <strong>Binary Tree Zigzag</strong> in DSA</>, time: '2 minutes ago' },
  { type: 'purple', text: <><strong>DSA Sprint Round 7</strong> is now live!</>, time: '15 minutes ago' },
  { type: 'orange', text: <><strong>Priya Sharma</strong> overtook your rank in Batch leaderboard</>, time: '1 hour ago' },
  { type: 'blue', text: <><strong>DBMS Fundamentals Quiz</strong> starts tomorrow</>, time: '3 hours ago' },
  { type: 'green', text: <><strong>You</strong> completed the <strong>CN Protocol</strong> skill badge</>, time: 'Yesterday' },
];

const rankClass = (r) => r === 1 ? 'gold' : r === 2 ? 'silver' : r === 3 ? 'bronze' : 'other';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [active, setActive] = useState('dashboard');

  const userName = user?.name || 'Student';
  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="app-layout">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <h2>CampusIQ</h2>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Main Menu</span>
          {SIDEBAR_ITEMS.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className={`sidebar-item ${active === item.id ? 'active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </div>
          ))}

          <span className="sidebar-section-label" style={{ marginTop: 8 }}>Insights</span>
          {SIDEBAR_ITEMS.slice(5).map((item) => (
            <div
              key={item.id}
              className={`sidebar-item ${active === item.id ? 'active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background: colorFor(userName) }}>
              {initials}
            </div>
            <div className="sidebar-user-info">
              <h4>{userName}</h4>
              <p>{user?.role || 'Student'}</p>
            </div>
            <button className="btn-logout" onClick={logout} title="Logout">⏻</button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-title">
            <h1>👋 Welcome back, {userName.split(' ')[0]}!</h1>
            <p>Here's what's happening on campus today</p>
          </div>
          <div className="topbar-actions">
            <input className="topbar-search" placeholder="🔍  Search problems, contests…" />
            <button className="topbar-btn primary">+ Join Contest</button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">

          {/* Stat Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">🏆</div>
              <div className="stat-info">
                <h3>2,847</h3>
                <p>Total Points</p>
                <div className="change up">↑ +125 this week</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <div className="stat-info">
                <h3>460</h3>
                <p>Problems Solved</p>
                <div className="change up">↑ +12 today</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">🎯</div>
              <div className="stat-info">
                <h3>#14</h3>
                <p>Batch Rank</p>
                <div className="change up">↑ +3 positions</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">🔥</div>
              <div className="stat-info">
                <h3>23</h3>
                <p>Day Streak</p>
                <div className="change up">↑ Personal best!</div>
              </div>
            </div>
          </div>

          {/* Contest + Leaderboard */}
          <div className="section-grid">
            {/* Contests */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3>🏆 Active & Upcoming Contests</h3>
                  <p><span className="live-dot" />1 contest live right now</p>
                </div>
                <span className="view-all">View all →</span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <table className="contest-table">
                  <thead>
                    <tr>
                      <th>Contest</th>
                      <th>Subject</th>
                      <th>Difficulty</th>
                      <th>Participants</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONTESTS.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td><span className="badge" style={{ background: 'rgba(108,99,255,0.12)', color: 'var(--accent-primary)' }}>{c.subject}</span></td>
                        <td><span className={`badge ${c.difficulty.toLowerCase()}`}>{c.difficulty}</span></td>
                        <td>{c.participants.toLocaleString()}</td>
                        <td style={{ color: c.status === 'live' ? 'var(--accent-green)' : 'var(--text-secondary)', fontSize: 13 }}>
                          {c.status === 'live' && <span className="live-dot" />}{c.time}
                        </td>
                        <td>
                          {c.status === 'live' && <button className="contest-btn">Enter Now</button>}
                          {c.status === 'upcoming' && <button className="contest-btn secondary">Register</button>}
                          {c.status === 'ended' && <button className="contest-btn secondary">Results</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3>📊 Leaderboard</h3>
                  <p>Batch CSE-A 2025</p>
                </div>
                <span className="view-all">Full board →</span>
              </div>
              <div className="card-body">
                <div className="leaderboard-list">
                  {LEADERBOARD.map((entry) => (
                    <div className="lb-item" key={entry.rank}>
                      <div className={`lb-rank ${rankClass(entry.rank)}`}>
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                      </div>
                      <div
                        className="lb-avatar"
                        style={{ background: colorFor(entry.name) }}
                      >
                        {entry.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
                      </div>
                      <div className="lb-info">
                        <h4>{entry.name}</h4>
                        <p>{entry.batch}</p>
                      </div>
                      <div className="lb-score">
                        {entry.score.toLocaleString()}
                        <span className={`lb-trend ${entry.trend}`}>
                          {entry.trend === 'up' ? ' ↑' : ' ↓'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div>
                <h3>🎯 Skill Benchmarking</h3>
                <p>Your progress across all subjects</p>
              </div>
            </div>
            <div className="card-body">
              <div className="skills-grid">
                {SKILLS.map((skill) => (
                  <div className="skill-card" key={skill.id}>
                    <div className="skill-header">
                      <div className="skill-icon" style={{ background: skill.bg }}>{skill.icon}</div>
                      <div>
                        <div className="skill-name">{skill.label}</div>
                        <div className="skill-count">{skill.solved}/{skill.total} solved</div>
                      </div>
                    </div>
                    <div className="skill-progress-bar">
                      <div
                        className="skill-progress-fill"
                        style={{ width: `${skill.pct}%`, background: skill.color }}
                      />
                    </div>
                    <div className="skill-stats">
                      <span>{skill.pct}%</span> completed
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3>🔔 Recent Activity</h3>
                <p>Latest events from your campus</p>
              </div>
            </div>
            <div className="card-body">
              <div className="activity-list">
                {ACTIVITY.map((a, i) => (
                  <div className="activity-item" key={i}>
                    <div className={`activity-dot ${a.type}`} />
                    <div>
                      <div className="activity-text">{a.text}</div>
                      <div className="activity-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
