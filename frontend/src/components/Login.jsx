import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email: cleanEmail, password: cleanPassword }
      );
      login(response.data.token, response.data.refreshToken);
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Invalid email or password. Please verify your credentials.'
          : 'Unable to connect to login service. Please try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email: demoEmail, password: demoPassword }
      );
      login(response.data.token, response.data.refreshToken);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <div className="login-logo-icon">🎓</div>
          <h1>CampusIQ</h1>
        </div>
        <p className="login-subtitle">Competitive Learning & Skill Benchmarking</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="persona-selector">
          <div className="persona-title">⚡ 1-Click Persona Demo Login</div>
          <div className="persona-grid">
            <button
              type="button"
              className="persona-btn admin"
              onClick={() => handleQuickLogin('admin@campusiq.com', 'admin123')}
              disabled={loading}
            >
              <span className="role-tag">👑 ADMIN</span>
              <span className="name-tag">System Admin</span>
            </button>
            <button
              type="button"
              className="persona-btn faculty"
              onClick={() => handleQuickLogin('tester@campusiq.com', 'password123')}
              disabled={loading}
            >
              <span className="role-tag">👨‍🏫 FACULTY</span>
              <span className="name-tag">Prof. Sharma (DSA)</span>
            </button>
            <button
              type="button"
              className="persona-btn student"
              onClick={() => handleQuickLogin('arpit@campusiq.com', 'password123')}
              disabled={loading}
            >
              <span className="role-tag">🎓 STUDENT</span>
              <span className="name-tag">Arpit Verma (#2)</span>
            </button>
            <button
              type="button"
              className="persona-btn student"
              onClick={() => handleQuickLogin('priya@campusiq.com', 'password123')}
              disabled={loading}
            >
              <span className="role-tag">🎓 STUDENT</span>
              <span className="name-tag">Priya Sharma (#3)</span>
            </button>
          </div>
        </div>

        <p className="login-register" style={{ marginTop: 18 }}>
          Don't have an account? <a href="#">Contact your administrator</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
