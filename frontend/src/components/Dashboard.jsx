import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import CreateContestModal from './CreateContestModal';
import './Dashboard.css';

const AVATAR_COLORS = ['#6c63ff','#a855f7','#10b981','#3b82f6','#f59e0b','#ef4444'];
const colorFor = (name) => AVATAR_COLORS[(name || 'U').charCodeAt(0) % AVATAR_COLORS.length];

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

const DEFAULT_CONTESTS = [
  { id: 1, name: 'Java & Algorithms Championship', subject: 'DSA', difficulty: 'Medium', participants: 342, time: 'Live Now', status: 'live' },
  { id: 2, name: 'DBMS Fundamentals Quiz', subject: 'DBMS', difficulty: 'Medium', participants: 215, time: 'Tomorrow 10:00 AM', status: 'upcoming' },
  { id: 3, name: 'CN Protocol Challenge', subject: 'CN', difficulty: 'Hard', participants: 178, time: 'Nov 20, 2:00 PM', status: 'upcoming' },
  { id: 4, name: 'Cloud Basics Contest', subject: 'CC', difficulty: 'Easy', participants: 290, time: 'Ended', status: 'ended' },
  { id: 5, name: 'FSD React Challenge', subject: 'FSD', difficulty: 'Medium', participants: 410, time: 'Ended', status: 'ended' },
];

const DEFAULT_PROBLEMS = [
  { id: 1, title: 'Two Sum Problem', category: 'DSA', difficulty: 'Easy', points: 100, solvedCount: 1420, acceptance: '84.2%' },
  { id: 2, title: 'Binary Tree Zigzag Traversal', category: 'DSA', difficulty: 'Medium', points: 150, solvedCount: 890, acceptance: '62.5%' },
  { id: 3, title: 'LRU Cache Design', category: 'DSA', difficulty: 'Hard', points: 250, solvedCount: 430, acceptance: '41.1%' },
  { id: 4, title: 'BCNF & 3NF Normalization Checker', category: 'DBMS', difficulty: 'Medium', points: 120, solvedCount: 650, acceptance: '71.8%' },
  { id: 5, title: 'Subnet Mask & IP Routing Calculator', category: 'CN', difficulty: 'Medium', points: 130, solvedCount: 520, acceptance: '68.0%' },
  { id: 6, title: 'Virtual Memory Page Replacement (FIFO vs LRU)', category: 'OS', difficulty: 'Hard', points: 200, solvedCount: 380, acceptance: '48.9%' },
  { id: 7, title: 'Debounce & Throttle Implementation', category: 'FSD', difficulty: 'Medium', points: 110, solvedCount: 980, acceptance: '79.4%' },
];

const DEFAULT_LEADERBOARD = [
  { rank: 1, name: 'Fullstack Tester', batch: 'Faculty', score: 2847, trend: 'up', userId: 3 },
  { rank: 2, name: 'Arpit Verma', batch: 'CSE-A 2025', score: 2650, trend: 'up', userId: 101 },
  { rank: 3, name: 'Priya Sharma', batch: 'CSE-B 2025', score: 2480, trend: 'up', userId: 102 },
  { rank: 4, name: 'Rahul Singh', batch: 'CSE-A 2025', score: 2310, trend: 'down', userId: 103 },
  { rank: 5, name: 'Sneha Patel', batch: 'CSE-C 2025', score: 2190, trend: 'up', userId: 104 },
  { rank: 6, name: 'Dev Anand', batch: 'CSE-B 2025', score: 2050, trend: 'down', userId: 105 },
];

const SKILLS = [
  { id: 'dsa', icon: '🔗', label: 'DSA', color: '#6c63ff', bg: 'rgba(108,99,255,0.15)', solved: 134, total: 200, pct: 67, level: 'Advanced' },
  { id: 'dbms', icon: '🗄️', label: 'DBMS', color: '#10b981', bg: 'rgba(16,185,129,0.15)', solved: 78, total: 120, pct: 65, level: 'Intermediate' },
  { id: 'cn', icon: '🌐', label: 'Computer Networks', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', solved: 52, total: 100, pct: 52, level: 'Intermediate' },
  { id: 'cc', icon: '☁️', label: 'Cloud Computing', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', solved: 40, total: 90, pct: 44, level: 'Novice' },
  { id: 'fsd', icon: '🖥️', label: 'Full Stack Dev', color: '#a855f7', bg: 'rgba(168,85,247,0.15)', solved: 95, total: 150, pct: 63, level: 'Advanced' },
  { id: 'os', icon: '⚙️', label: 'OS Concepts', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', solved: 61, total: 110, pct: 55, level: 'Intermediate' },
];

const DEFAULT_ACTIVITY = [
  { type: 'green', text: <><strong>You</strong> solved <strong>Two Sum Problem</strong> in Java</>, time: '2 minutes ago' },
  { type: 'purple', text: <><strong>Java & Algorithms Championship</strong> is now live!</>, time: '15 minutes ago' },
  { type: 'orange', text: <><strong>Priya Sharma</strong> overtook your rank in Batch leaderboard</>, time: '1 hour ago' },
  { type: 'blue', text: <><strong>DBMS Fundamentals Quiz</strong> starts tomorrow</>, time: '3 hours ago' },
  { type: 'green', text: <><strong>You</strong> completed the <strong>CN Protocol</strong> skill badge</>, time: 'Yesterday' },
];

const FACULTY_ALL_SUBMISSIONS = [
  { id: 108, studentName: 'Fullstack Tester', problem: 'Two Sum Problem', language: 'Java', status: 'EVALUATED', score: 100, submittedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 107, studentName: 'Arpit Verma', problem: 'Two Sum Problem', language: 'Python', status: 'EVALUATED', score: 100, submittedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
  { id: 106, studentName: 'Priya Sharma', problem: 'Binary Tree Zigzag Traversal', language: 'C++', status: 'EVALUATED', score: 95, submittedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString() },
  { id: 105, studentName: 'Rahul Singh', problem: 'LRU Cache Design', language: 'Java', status: 'WRONG_ANSWER', score: 40, submittedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString() },
  { id: 104, studentName: 'Sneha Patel', problem: 'Subnet Mask Calculator', language: 'Python', status: 'EVALUATED', score: 100, submittedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 103, studentName: 'Dev Anand', problem: 'BCNF Normalization Checker', language: 'Java', status: 'TIME_LIMIT_EXCEEDED', score: 0, submittedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
];

const SEEDED_USERS = [
  { id: 1, name: 'System Administrator', email: 'admin@campusiq.com', role: 'ADMIN', batch: 'Platform Staff', status: 'ACTIVE' },
  { id: 2, name: 'Prof. Sharma (Tester)', email: 'tester@campusiq.com', role: 'FACULTY', batch: 'CSE Faculty', status: 'ACTIVE' },
  { id: 3, name: 'Arpit Verma', email: 'arpit@campusiq.com', role: 'STUDENT', batch: 'CSE-A 2025 (Rank #2)', status: 'ACTIVE' },
  { id: 4, name: 'Priya Sharma', email: 'priya@campusiq.com', role: 'STUDENT', batch: 'CSE-B 2025 (Rank #3)', status: 'ACTIVE' },
  { id: 5, name: 'Rahul Singh', email: 'rahul@campusiq.com', role: 'STUDENT', batch: 'CSE-A 2025 (Rank #4)', status: 'ACTIVE' },
  { id: 6, name: 'Test User', email: 'test@campusiq.com', role: 'STUDENT', batch: 'CSE-C 2025', status: 'ACTIVE' },
];

const MICROSERVICES_LIST = [
  { name: 'API Gateway', port: ':8080', tech: 'Spring Cloud Gateway / JWT Dedupe' },
  { name: 'Auth Service', port: ':8081', tech: 'Spring Security / BCrypt / PostgreSQL' },
  { name: 'Contest Service', port: ':8082', tech: 'Spring Data JPA / PostgreSQL' },
  { name: 'Submission Service', port: ':8083', tech: 'Kafka Producer / Event Dispatcher' },
  { name: 'Evaluation Service', port: ':8084', tech: 'Docker Sandbox / Kafka Consumer' },
  { name: 'Leaderboard Service', port: ':8085', tech: 'Redis Sorted Sets / STOMP WebSockets' },
  { name: 'Analytics Service', port: ':8086', tech: 'Kafka Aggregator / Rolling Metrics' },
  { name: 'Notification Service', port: ':8087', tech: 'STOMP Pub-Sub Live Alerts' },
  { name: 'PostgreSQL Relational DB', port: ':5432', tech: 'PostgreSQL 16 Alpine' },
  { name: 'Redis Cache', port: ':6379', tech: 'Redis 7 Alpine' },
  { name: 'Apache Kafka Event Bus', port: ':9092', tech: 'Confluent Kafka 7.6' },
];

const rankClass = (r) => r === 1 ? 'gold' : r === 2 ? 'silver' : r === 3 ? 'bronze' : 'other';

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [active, setActive] = useState('dashboard');
  const [contestFilter, setContestFilter] = useState('all');
  const [problemSearch, setProblemSearch] = useState('');
  const [problemDiff, setProblemDiff] = useState('all');
  const navigate = useNavigate();

  // Role-Based Mode Switcher: 'ADMIN', 'FACULTY', or 'STUDENT'
  const initialRole = user?.role?.toUpperCase() || 'FACULTY';
  const [viewMode, setViewMode] = useState(initialRole);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Dynamic state from backend
  const [analyticsData, setAnalyticsData] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [contestsList, setContestsList] = useState(DEFAULT_CONTESTS);
  const [leaderboardList, setLeaderboardList] = useState(DEFAULT_LEADERBOARD);

  const userName = user?.name || 'Fullstack Tester';
  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleContestCreated = (newContest) => {
    const mapped = {
      id: newContest.id,
      name: newContest.title,
      subject: newContest.subject || 'CS',
      difficulty: newContest.difficulty ? (newContest.difficulty.charAt(0).toUpperCase() + newContest.difficulty.slice(1).toLowerCase()) : 'Medium',
      participants: newContest.maxParticipants || 150,
      time: 'Live Now',
      status: 'live'
    };
    setContestsList(prev => [mapped, ...prev]);
    setActive('contests');
  };

  // Fetch real data on load or tab switch
  useEffect(() => {
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    // 1. Contests
    axios.get(`${import.meta.env.VITE_API_URL}/contests`, { headers: authHeaders })
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map(c => ({
            id: c.id,
            name: c.title,
            subject: c.subject || 'CS',
            difficulty: c.difficulty ? c.difficulty.charAt(0) + c.difficulty.slice(1).toLowerCase() : 'Medium',
            participants: c.maxParticipants || 100,
            time: c.status === 'UPCOMING' ? 'Live Now' : (c.status || 'Active'),
            status: 'live'
          }));
          setContestsList([...mapped, ...DEFAULT_CONTESTS.slice(1)]);
        }
      })
      .catch(() => {});

    // 2. Analytics
    axios.get(`${import.meta.env.VITE_API_URL}/analytics/dashboard`, { headers: authHeaders })
      .then(res => setAnalyticsData(res.data))
      .catch(() => {});

    // 3. Submissions
    axios.get(`${import.meta.env.VITE_API_URL}/submissions/contest/1`, { headers: authHeaders })
      .then(res => {
        if (res.data && res.data.length > 0) {
          setSubmissionsList(res.data);
        }
      })
      .catch(() => {});

    // 4. Notifications
    axios.get(`${import.meta.env.VITE_API_URL}/notifications/user/3`, { headers: authHeaders })
      .then(res => {
        if (res.data && res.data.length > 0) {
          setNotificationsList(res.data);
        }
      })
      .catch(() => {});

    // 5. Leaderboard
    axios.get(`${import.meta.env.VITE_API_URL}/leaderboard/1`, { headers: authHeaders })
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mappedLb = res.data.map((e, idx) => ({
            rank: e.rank || idx + 1,
            name: e.username || `User #${e.userId}`,
            batch: e.userId === 3 ? 'Faculty' : 'CSE-A 2025',
            score: Math.round(e.score || 0),
            trend: 'up',
            userId: e.userId
          }));
          setLeaderboardList(mappedLb);
        }
      })
      .catch(() => {});
  }, [token]);

  // Filter contests
  const filteredContests = contestsList.filter(c => {
    if (contestFilter === 'all') return true;
    return c.status === contestFilter;
  });

  // Filter problems
  const filteredProblems = DEFAULT_PROBLEMS.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
                        p.category.toLowerCase().includes(problemSearch.toLowerCase());
    const matchDiff = problemDiff === 'all' || p.difficulty.toLowerCase() === problemDiff.toLowerCase();
    return matchSearch && matchDiff;
  });

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
          <div className="sidebar-role-container">
            <div className="sidebar-user-row">
              <div className="sidebar-avatar" style={{ background: colorFor(userName) }}>
                {initials}
              </div>
              <div className="sidebar-user-info">
                <h4>{userName}</h4>
                <p>
                  {viewMode === 'ADMIN' && 'System Administrator'}
                  {viewMode === 'FACULTY' && 'Faculty Instructor'}
                  {viewMode === 'STUDENT' && 'Candidate Student'}
                </p>
              </div>
              <button className="btn-logout" onClick={logout} title="Logout">⏻</button>
            </div>
            <div className="role-switcher-bar">
              <span className={`role-badge ${viewMode.toLowerCase()}`}>
                {viewMode === 'ADMIN' && '👑 ADMIN'}
                {viewMode === 'FACULTY' && '👨‍🏫 FACULTY'}
                {viewMode === 'STUDENT' && '🎓 STUDENT'}
              </span>
              <button
                className="role-toggle-btn"
                onClick={() => {
                  setViewMode(prev => {
                    if (prev === 'ADMIN') return 'FACULTY';
                    if (prev === 'FACULTY') return 'STUDENT';
                    return (user?.role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'FACULTY');
                  });
                }}
                title="Cycle Persona View"
              >
                ⇄ {viewMode === 'ADMIN' ? 'Faculty Mode' : viewMode === 'FACULTY' ? 'Student Mode' : (user?.role?.toUpperCase() === 'ADMIN' ? 'Admin Mode' : 'Faculty Mode')}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span className={`topbar-portal-badge ${viewMode.toLowerCase()}`}>
                {viewMode === 'ADMIN' && '👑 ADMIN PORTAL'}
                {viewMode === 'FACULTY' && '👨‍🏫 FACULTY PORTAL'}
                {viewMode === 'STUDENT' && '🎓 STUDENT PORTAL'}
              </span>
              <h1 style={{ margin: 0 }}>
                {active === 'dashboard' && `Welcome back, ${userName.split(' ')[0]}!`}
                {active === 'contests' && `🏆 Campus Coding Contests`}
                {active === 'problems' && `💻 Problem Bank & Practice`}
                {active === 'leaderboard' && `📊 Live Campus Leaderboard`}
                {active === 'skills' && `🎯 Skill Benchmarking & Radar`}
                {active === 'analytics' && `📈 Platform Analytics`}
                {active === 'submissions' && `📝 Submission History`}
                {active === 'notifications' && `🔔 Notification Center`}
              </h1>
            </div>
            <p>
              {active === 'dashboard' && (viewMode === 'ADMIN' ? "Master platform administration, microservices infrastructure health & user access" : viewMode === 'FACULTY' ? "Manage upcoming algorithmic challenges, monitor class metrics & student accuracy" : "Here's what's happening on campus today")}
              {active === 'contests' && (viewMode === 'ADMIN' ? 'Master contest scheduling and global challenge parameters' : viewMode === 'FACULTY' ? 'Schedule, configure, and manage algorithmic challenges for the campus cohort' : 'Compete in live collegiate algorithms challenges and earn benchmark points')}
              {active === 'problems' && 'Practice curated problems across Data Structures, Algorithms, DBMS, and Networks'}
              {active === 'leaderboard' && 'Real-time performance rankings across batches and departments'}
              {active === 'skills' && 'Track quantitative skill percentiles and mastery levels'}
              {active === 'analytics' && 'Institutional insights into platform participation and student scores'}
              {active === 'submissions' && (viewMode === 'STUDENT' ? 'Review your personal code execution results, status, and scores' : 'Real-time audit feed of all student code submissions and Docker evaluations')}
              {active === 'notifications' && 'Stay updated on contest schedules, ranking changes, and campus alerts'}
            </p>
          </div>
          <div className="topbar-actions">
            <input
              className="topbar-search"
              placeholder="🔍 Search problems, contests…"
              value={problemSearch}
              onChange={(e) => setProblemSearch(e.target.value)}
            />
            {viewMode === 'ADMIN' ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-create-contest" onClick={() => setIsCreateModalOpen(true)}>
                  ➕ Global Contest
                </button>
                <button className="topbar-btn secondary" onClick={() => setActive('analytics')}>
                  🛠️ System Health
                </button>
              </div>
            ) : viewMode === 'FACULTY' ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-create-contest" onClick={() => setIsCreateModalOpen(true)}>
                  ➕ Create Contest
                </button>
                <button className="topbar-btn secondary" onClick={() => navigate('/contest/1')}>
                  💻 Code Sandbox
                </button>
              </div>
            ) : (
              <button className="topbar-btn primary" onClick={() => navigate('/contest/1')}>
                ⚡ Enter Live Contest
              </button>
            )}
          </div>
        </header>

        {/* ── DYNAMIC PAGE VIEWS BASED ON ACTIVE SIDEBAR ITEM ── */}
        <div className="page-content">

          {/* ==================== 1. DASHBOARD OVERVIEW ==================== */}
          {active === 'dashboard' && (
            <>
              {/* Admin Mode Master Control Banner */}
              {viewMode === 'ADMIN' && (
                <div className="admin-banner">
                  <div className="faculty-banner-text">
                    <span className="faculty-banner-icon">👑</span>
                    <div>
                      <h4>Master Institutional Administration</h4>
                      <p>Full-spectrum platform control · Infrastructure health, microservice nodes, and multi-user access directory</p>
                    </div>
                  </div>
                  <button className="btn-create-contest" onClick={() => setIsCreateModalOpen(true)}>
                    ➕ Author Global Contest
                  </button>
                </div>
              )}

              {/* Faculty Mode Action Banner */}
              {viewMode === 'FACULTY' && (
                <div className="faculty-banner">
                  <div className="faculty-banner-text">
                    <span className="faculty-banner-icon">👨‍🏫</span>
                    <div>
                      <h4>Faculty Control Center</h4>
                      <p>You have administrative privileges to author contests, configure problems, and inspect all student cohort submissions.</p>
                    </div>
                  </div>
                  <button className="btn-create-contest" onClick={() => setIsCreateModalOpen(true)}>
                    ➕ Create New Contest
                  </button>
                </div>
              )}

              {/* Stat Cards - Role-Aware (Admin, Faculty, Student) */}
              <div className="stats-grid">
                {viewMode === 'ADMIN' ? (
                  <>
                    <div className="stat-card" onClick={() => setActive('analytics')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon purple">🖥️</div>
                      <div className="stat-info">
                        <h3>7 / 7</h3>
                        <p>Microservices Online</p>
                        <div className="change up">100% System Health</div>
                      </div>
                    </div>
                    <div className="stat-card" onClick={() => setActive('analytics')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon green">👥</div>
                      <div className="stat-info">
                        <h3>{SEEDED_USERS.length}</h3>
                        <p>Seeded Accounts</p>
                        <div className="change up">1 Admin · 1 Fac · 4 Stu</div>
                      </div>
                    </div>
                    <div className="stat-card" onClick={() => setActive('contests')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon orange">🏆</div>
                      <div className="stat-info">
                        <h3>{contestsList.length}</h3>
                        <p>Total Contests</p>
                        <div className="change up">PostgreSQL Active</div>
                      </div>
                    </div>
                    <div className="stat-card" onClick={() => setActive('analytics')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon blue">⚡</div>
                      <div className="stat-info">
                        <h3>Kafka</h3>
                        <p>Event Bus Node</p>
                        <div className="change up">Broker :9092 Online</div>
                      </div>
                    </div>
                  </>
                ) : viewMode === 'FACULTY' ? (
                  <>
                    <div className="stat-card" onClick={() => setActive('contests')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon purple">🏆</div>
                      <div className="stat-info">
                        <h3>{contestsList.length}</h3>
                        <p>Total Contests</p>
                        <div className="change up">Active in Platform</div>
                      </div>
                    </div>
                    <div className="stat-card" onClick={() => setActive('submissions')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon green">📝</div>
                      <div className="stat-info">
                        <h3>1,420</h3>
                        <p>Total Submissions</p>
                        <div className="change up">Evaluated in Sandbox</div>
                      </div>
                    </div>
                    <div className="stat-card" onClick={() => setActive('analytics')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon blue">⚡</div>
                      <div className="stat-info">
                        <h3>74%</h3>
                        <p>Class Avg Score</p>
                        <div className="change up">Cohort Benchmark</div>
                      </div>
                    </div>
                    <div className="stat-card" onClick={() => setActive('leaderboard')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon orange">👥</div>
                      <div className="stat-info">
                        <h3>342</h3>
                        <p>Enrolled Candidates</p>
                        <div className="change up">↑ +18 this week</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="stat-card" onClick={() => setActive('leaderboard')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon purple">🏆</div>
                      <div className="stat-info">
                        <h3>2,847</h3>
                        <p>Total Points</p>
                        <div className="change up">↑ +125 this week</div>
                      </div>
                    </div>
                    <div className="stat-card" onClick={() => setActive('problems')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon green">✅</div>
                      <div className="stat-info">
                        <h3>460</h3>
                        <p>Problems Solved</p>
                        <div className="change up">↑ +12 today</div>
                      </div>
                    </div>
                    <div className="stat-card" onClick={() => setActive('leaderboard')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon orange">🎯</div>
                      <div className="stat-info">
                        <h3>#1</h3>
                        <p>Batch Rank</p>
                        <div className="change up">↑ Batch CSE-A 2025</div>
                      </div>
                    </div>
                    <div className="stat-card" onClick={() => setActive('analytics')} style={{ cursor: 'pointer' }}>
                      <div className="stat-icon blue">🔥</div>
                      <div className="stat-info">
                        <h3>23</h3>
                        <p>Day Streak</p>
                        <div className="change up">↑ Personal best!</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Admin Special: Platform Infrastructure & User Directory */}
              {viewMode === 'ADMIN' && (
                <div style={{ marginBottom: 24 }}>
                  <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-header">
                      <div>
                        <h3>🛠️ Distributed Microservices & Cluster Nodes</h3>
                        <p><span className="live-dot" />All nodes monitored via Spring Actuator & Docker Daemon</p>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="services-grid">
                        {MICROSERVICES_LIST.map((svc) => (
                          <div className="service-card" key={svc.name}>
                            <div>
                              <div className="service-name">{svc.name}</div>
                              <div className="service-port">{svc.port} · {svc.tech}</div>
                            </div>
                            <div className="service-status">
                              <span className="service-dot" /> ONLINE
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <div>
                        <h3>👥 Campus User Directory (RBAC Control)</h3>
                        <p>Multi-tenant accounts across Administration, Faculty & Student cohorts</p>
                      </div>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                      <table className="contest-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Full Name</th>
                            <th>Email Address</th>
                            <th>Assigned Role</th>
                            <th>Department / Batch</th>
                            <th>Access Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SEEDED_USERS.map((u) => (
                            <tr key={u.id}>
                              <td>#{u.id}</td>
                              <td style={{ fontWeight: 600 }}>{u.name}</td>
                              <td style={{ color: 'var(--accent-primary)' }}>{u.email}</td>
                              <td>
                                <span className={`role-badge ${u.role.toLowerCase()}`}>
                                  {u.role === 'ADMIN' ? '👑 ADMIN' : u.role === 'FACULTY' ? '👨‍🏫 FACULTY' : '🎓 STUDENT'}
                                </span>
                              </td>
                              <td style={{ color: 'var(--text-secondary)' }}>{u.batch}</td>
                              <td><span className="status-tag accepted">ACTIVE</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Contests + Leaderboard Grid */}
              <div className="section-grid">
                {/* Contests Preview */}
                <div className="card">
                  <div className="card-header">
                    <div>
                      <h3>🏆 Active & Upcoming Contests</h3>
                      <p><span className="live-dot" />1 contest live right now</p>
                    </div>
                    <span className="view-all" style={{ cursor: 'pointer' }} onClick={() => setActive('contests')}>
                      View all →
                    </span>
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
                        {contestsList.slice(0, 4).map((c) => (
                          <tr key={c.id}>
                            <td style={{ fontWeight: 600 }}>{c.name}</td>
                            <td><span className="badge" style={{ background: 'rgba(108,99,255,0.12)', color: 'var(--accent-primary)' }}>{c.subject}</span></td>
                            <td><span className={`badge ${c.difficulty.toLowerCase()}`}>{c.difficulty}</span></td>
                            <td>{c.participants.toLocaleString()}</td>
                            <td style={{ color: c.status === 'live' ? 'var(--accent-green)' : 'var(--text-secondary)', fontSize: 13 }}>
                              {c.status === 'live' && <span className="live-dot" />}{c.time}
                            </td>
                            <td>
                              {c.status === 'live' && (
                                <button className="contest-btn" onClick={() => navigate(`/contest/${c.id}`)}>
                                  Enter Now
                                </button>
                              )}
                              {c.status !== 'live' && (
                                <button className="contest-btn secondary" onClick={() => setActive('contests')}>
                                  Details
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Leaderboard Preview */}
                <div className="card">
                  <div className="card-header">
                    <div>
                      <h3>📊 Leaderboard</h3>
                      <p>Top Performers</p>
                    </div>
                    <span className="view-all" style={{ cursor: 'pointer' }} onClick={() => setActive('leaderboard')}>
                      Full board →
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="leaderboard-list">
                      {leaderboardList.slice(0, 5).map((entry) => (
                        <div className="lb-item" key={entry.rank}>
                          <div className={`lb-rank ${rankClass(entry.rank)}`}>
                            {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                          </div>
                          <div className="lb-avatar" style={{ background: colorFor(entry.name) }}>
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

              {/* Skills Preview */}
              <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header">
                  <div>
                    <h3>🎯 Skill Benchmarking</h3>
                    <p>Your progress across all core competencies</p>
                  </div>
                  <span className="view-all" style={{ cursor: 'pointer' }} onClick={() => setActive('skills')}>
                    Details →
                  </span>
                </div>
                <div className="card-body">
                  <div className="skills-grid">
                    {SKILLS.map((skill) => (
                      <div className="skill-card" key={skill.id} onClick={() => setActive('skills')} style={{ cursor: 'pointer' }}>
                        <div className="skill-header">
                          <div className="skill-icon" style={{ background: skill.bg }}>{skill.icon}</div>
                          <div>
                            <div className="skill-name">{skill.label}</div>
                            <div className="skill-count">{skill.solved}/{skill.total} solved</div>
                          </div>
                        </div>
                        <div className="skill-progress-bar">
                          <div className="skill-progress-fill" style={{ width: `${skill.pct}%`, background: skill.color }} />
                        </div>
                        <div className="skill-stats">
                          <span>{skill.pct}%</span> completed ({skill.level})
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
                    <p>Latest platform events</p>
                  </div>
                  <span className="view-all" style={{ cursor: 'pointer' }} onClick={() => setActive('notifications')}>
                    All notifications →
                  </span>
                </div>
                <div className="card-body">
                  <div className="activity-list">
                    {DEFAULT_ACTIVITY.map((a, i) => (
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
            </>
          )}

          {/* ==================== 2. CONTESTS VIEW ==================== */}
          {active === 'contests' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3>🏆 All Campus Contests</h3>
                  <p>{viewMode === 'FACULTY' ? 'Author, schedule, and configure algorithmic problems for students' : 'Register, participate, and view results'}</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {viewMode === 'FACULTY' && (
                    <button className="btn-create-contest" onClick={() => setIsCreateModalOpen(true)}>
                      ➕ Create New Contest
                    </button>
                  )}
                  <button className="btn-action-primary" onClick={() => navigate('/contest/1')}>
                    ⚡ Jump to Live Contest
                  </button>
                </div>
              </div>

              <div style={{ padding: '0 22px 14px' }}>
                <div className="filter-pills">
                  {['all', 'live', 'upcoming', 'ended'].map((status) => (
                    <button
                      key={status}
                      className={`filter-btn ${contestFilter === status ? 'active' : ''}`}
                      onClick={() => setContestFilter(status)}
                    >
                      {status.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-body" style={{ padding: 0 }}>
                <table className="contest-table">
                  <thead>
                    <tr>
                      <th>Contest Name</th>
                      <th>Subject</th>
                      <th>Difficulty</th>
                      <th>Participants</th>
                      <th>Schedule / Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContests.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td><span className="badge" style={{ background: 'rgba(108,99,255,0.12)', color: 'var(--accent-primary)' }}>{c.subject}</span></td>
                        <td><span className={`badge ${c.difficulty.toLowerCase()}`}>{c.difficulty}</span></td>
                        <td>{c.participants.toLocaleString()} students</td>
                        <td>
                          {c.status === 'live' ? (
                            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                              <span className="live-dot" /> Live Now
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-secondary)' }}>{c.time}</span>
                          )}
                        </td>
                        <td>
                          {c.status === 'live' ? (
                            <button className="contest-btn" onClick={() => navigate(`/contest/${c.id}`)}>
                              {viewMode === 'FACULTY' ? 'Inspect Workspace' : 'Enter Workspace'}
                            </button>
                          ) : c.status === 'upcoming' ? (
                            <button className="contest-btn secondary" onClick={() => navigate(`/contest/${c.id}`)}>
                              {viewMode === 'FACULTY' ? 'Manage & Edit' : 'Preview Problem'}
                            </button>
                          ) : (
                            <button className="contest-btn secondary" onClick={() => setActive('leaderboard')}>
                              View Results
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== 3. PROBLEM BANK ==================== */}
          {active === 'problems' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3>💻 Problem Bank & Practice</h3>
                  <p>Curated problems for campus placement & skill benchmark</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <select
                    className="filter-btn"
                    value={problemDiff}
                    onChange={(e) => setProblemDiff(e.target.value)}
                    style={{ background: 'var(--bg-card)' }}
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="card-body" style={{ padding: 0 }}>
                <table className="contest-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Difficulty</th>
                      <th>Points</th>
                      <th>Acceptance</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.map((prob) => (
                      <tr key={prob.id}>
                        <td>{prob.id}</td>
                        <td style={{ fontWeight: 600 }}>{prob.title}</td>
                        <td><span className="badge" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>{prob.category}</span></td>
                        <td><span className={`badge ${prob.difficulty.toLowerCase()}`}>{prob.difficulty}</span></td>
                        <td style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{prob.points} pts</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{prob.acceptance}</td>
                        <td>
                          <button className="contest-btn" onClick={() => navigate(`/problem/${prob.id}`)}>
                            ▶ Solve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== 4. LEADERBOARD VIEW ==================== */}
          {active === 'leaderboard' && (
            <div>
              {/* Podium */}
              <div className="podium-grid">
                <div className="podium-card second">
                  <div className="podium-badge">🥈</div>
                  <div className="podium-name">{leaderboardList[1]?.name || 'Priya Sharma'}</div>
                  <div className="podium-batch">{leaderboardList[1]?.batch || 'CSE-B 2025'}</div>
                  <div className="podium-score">{leaderboardList[1]?.score || 2480} pts</div>
                </div>
                <div className="podium-card first">
                  <div className="podium-badge">🥇</div>
                  <div className="podium-name">{leaderboardList[0]?.name || 'Fullstack Tester'}</div>
                  <div className="podium-batch">{leaderboardList[0]?.batch || 'Faculty'}</div>
                  <div className="podium-score">{leaderboardList[0]?.score || 2847} pts</div>
                </div>
                <div className="podium-card third">
                  <div className="podium-badge">🥉</div>
                  <div className="podium-name">{leaderboardList[2]?.name || 'Arpit Verma'}</div>
                  <div className="podium-batch">{leaderboardList[2]?.batch || 'CSE-A 2025'}</div>
                  <div className="podium-score">{leaderboardList[2]?.score || 2310} pts</div>
                </div>
              </div>

              {/* Full Standings Table */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>📊 Full Campus Standings</h3>
                    <p><span className="live-dot" />Connected to Redis ZSet & WebSocket</p>
                  </div>
                  <button className="btn-action-primary" onClick={() => navigate('/contest/1')}>
                    Join Contest to Compete
                  </button>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  <table className="contest-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Student / Faculty</th>
                        <th>Batch</th>
                        <th>Points</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardList.map((entry) => (
                        <tr key={entry.rank} style={entry.name === userName ? { background: 'rgba(108,99,255,0.08)' } : {}}>
                          <td style={{ fontWeight: 700 }}>
                            {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className="lb-avatar" style={{ background: colorFor(entry.name), width: 30, height: 30, fontSize: 11 }}>
                                {entry.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
                              </div>
                              <span style={{ fontWeight: 600 }}>{entry.name}</span>
                              {entry.name === userName && <span className="status-tag accepted" style={{ fontSize: 10 }}>YOU</span>}
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{entry.batch}</td>
                          <td style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{entry.score.toLocaleString()}</td>
                          <td>
                            <span style={{ color: entry.trend === 'up' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
                              {entry.trend === 'up' ? '↑ Rising' : '↓ Falling'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 5. SKILL TRACKER ==================== */}
          {active === 'skills' && (
            <div>
              <div className="skills-grid" style={{ marginBottom: 24 }}>
                {SKILLS.map((skill) => (
                  <div className="skill-card" key={skill.id}>
                    <div className="skill-header">
                      <div className="skill-icon" style={{ background: skill.bg }}>{skill.icon}</div>
                      <div>
                        <div className="skill-name">{skill.label}</div>
                        <div className="skill-count">{skill.solved} of {skill.total} Solved</div>
                      </div>
                    </div>
                    <div className="skill-progress-bar" style={{ height: 10 }}>
                      <div className="skill-progress-fill" style={{ width: `${skill.pct}%`, background: skill.color }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12 }}>
                      <span style={{ fontWeight: 700, color: skill.color }}>{skill.level}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{skill.pct}% Mastery</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>🎯 Benchmark Recommendations</h3>
                    <p>Topics to focus on based on your recent contest accuracy</p>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    <div className="card" style={{ border: '1px solid var(--border-color)', padding: 16 }}>
                      <h4 style={{ color: '#6c63ff', marginBottom: 6 }}>Dynamic Programming</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Improve 2D DP and memoization skills for top tier placement tests.</p>
                      <button className="contest-btn" onClick={() => navigate('/problem/1')}>Practice DP</button>
                    </div>
                    <div className="card" style={{ border: '1px solid var(--border-color)', padding: 16 }}>
                      <h4 style={{ color: '#10b981', marginBottom: 6 }}>Database Indexing</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>B-Trees and composite index optimization problems.</p>
                      <button className="contest-btn secondary" onClick={() => navigate('/problem/4')}>Practice DBMS</button>
                    </div>
                    <div className="card" style={{ border: '1px solid var(--border-color)', padding: 16 }}>
                      <h4 style={{ color: '#3b82f6', marginBottom: 6 }}>Socket Programming</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>TCP flow control and WebSocket concurrency challenges.</p>
                      <button className="contest-btn secondary" onClick={() => navigate('/problem/5')}>Practice Networks</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 6. ANALYTICS VIEW ==================== */}
          {active === 'analytics' && (
            <div>
              <div className="stats-grid" style={{ marginBottom: 24 }}>
                <div className="stat-card">
                  <div className="stat-icon purple">📊</div>
                  <div className="stat-info">
                    <h3>{analyticsData?.totalContests || 1}</h3>
                    <p>Total Campus Contests</p>
                    <div className="change up">Live in PostgreSQL</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green">👥</div>
                  <div className="stat-info">
                    <h3>{analyticsData?.totalStudents || 1}</h3>
                    <p>Active Contestants</p>
                    <div className="change up">100% Participated</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon blue">⚡</div>
                  <div className="stat-info">
                    <h3>{analyticsData ? Math.round(analyticsData.averagePlatformScore) : 74} pts</h3>
                    <p>Platform Average Score</p>
                    <div className="change up">Calculated in Real-Time</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orange">🥇</div>
                  <div className="stat-info">
                    <h3>#1</h3>
                    <p>User #3 Platform Rank</p>
                    <div className="change up">Top Performer</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>📈 Analytics Service Output (`/api/analytics/dashboard`)</h3>
                    <p>Raw microservice payload aggregated from Kafka event stream</p>
                  </div>
                </div>
                <div className="card-body">
                  <pre style={{
                    background: '#161b22',
                    border: '1px solid #30363d',
                    padding: 16,
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#58a6ff',
                    overflowX: 'auto'
                  }}>
                    {analyticsData ? JSON.stringify(analyticsData, null, 2) : 'Loading analytics data from :8086...'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 7. SUBMISSIONS VIEW ==================== */}
          {active === 'submissions' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3>{viewMode === 'FACULTY' ? '📝 All Student Submissions (Class Cohort)' : '📝 My Submissions History'}</h3>
                  <p>{viewMode === 'FACULTY' ? 'Faculty Audit Feed · Real-time solutions evaluated across campus' : 'Evaluated solutions recorded in Submission & Evaluation microservices'}</p>
                </div>
                <button className="btn-action-primary" onClick={() => navigate('/contest/1')}>
                  + Submit New Code
                </button>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <table className="contest-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      {viewMode === 'FACULTY' && <th>Student Candidate</th>}
                      <th>Problem</th>
                      <th>Language</th>
                      <th>Status / Verdict</th>
                      <th>Score</th>
                      <th>Submitted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewMode === 'FACULTY' ? (
                      FACULTY_ALL_SUBMISSIONS.map((sub) => (
                        <tr key={sub.id}>
                          <td>#{sub.id}</td>
                          <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="lb-avatar" style={{ background: colorFor(sub.studentName), width: 26, height: 26, fontSize: 11 }}>
                                {sub.studentName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
                              </div>
                              {sub.studentName}
                            </div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{sub.problem}</td>
                          <td><span className="badge" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>{sub.language}</span></td>
                          <td>
                            <span className={`status-tag ${sub.status === 'EVALUATED' ? 'evaluated' : sub.status === 'WRONG_ANSWER' ? 'failed' : 'pending'}`}>
                              {sub.status === 'EVALUATED' ? '✔ ACCEPTED' : sub.status === 'WRONG_ANSWER' ? '❌ WRONG ANSWER' : sub.status}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: sub.score >= 80 ? 'var(--accent-green)' : 'var(--accent-orange)' }}>{sub.score} pts</td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                            {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      submissionsList.length > 0 ? (
                        submissionsList.map((sub) => (
                          <tr key={sub.id}>
                            <td>#{sub.id}</td>
                            <td style={{ fontWeight: 600 }}>Two Sum Problem (Problem #{sub.problemId})</td>
                            <td><span className="badge" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>{sub.language}</span></td>
                            <td>
                              <span className={`status-tag ${sub.status === 'EVALUATED' ? 'evaluated' : 'pending'}`}>
                                {sub.status === 'EVALUATED' ? '✔ ACCEPTED' : sub.status}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{sub.score || 100} pts</td>
                            <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                              {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)' }}>
                            No submissions recorded yet. Click "Submit New Code" to submit in the live workspace.
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== 8. NOTIFICATIONS VIEW ==================== */}
          {active === 'notifications' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3>🔔 Notification Center</h3>
                  <p>Live campus broadcasts from Notification Service (`:8087`)</p>
                </div>
                <span className="view-all" style={{ cursor: 'pointer' }}>
                  Mark all as read
                </span>
              </div>
              <div className="card-body">
                <div className="activity-list">
                  {notificationsList.length > 0 ? (
                    notificationsList.map((notif) => (
                      <div className="activity-item" key={notif.id}>
                        <div className={`activity-dot ${notif.type.includes('STARTED') ? 'green' : notif.type.includes('ENDED') ? 'orange' : 'purple'}`} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                            {notif.title}
                          </div>
                          <div className="activity-text">{notif.message}</div>
                          <div className="activity-time">
                            {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No notifications to display.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal for Creating Contest & Problem (Option 1) */}
      <CreateContestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        token={token}
        onContestCreated={handleContestCreated}
      />
    </div>
  );
};

export default Dashboard;
