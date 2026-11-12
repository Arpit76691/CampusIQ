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

  const handleFillDemo = () => {
    setEmail('tester@campusiq.com');
    setPassword('password123');
    setError('');
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

        <div className="login-demo-hint">
          🔑 <strong>Faculty Demo Account:</strong>{' '}
          <span
            style={{ color: 'var(--accent-primary)', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={handleFillDemo}
          >
            Click to fill tester@campusiq.com / password123
          </span>
        </div>

        <p className="login-register" style={{ marginTop: 20 }}>
          Don't have an account? <a href="#">Contact your administrator</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
