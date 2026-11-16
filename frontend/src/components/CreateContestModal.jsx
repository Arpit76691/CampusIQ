import React, { useState } from 'react';
import axios from 'axios';
import './CreateContestModal.css';

const SUBJECT_OPTIONS = ['DSA', 'DBMS', 'CN', 'OS', 'FSD', 'Cloud Computing'];
const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];

const getDefaultStartTime = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const getDefaultEndTime = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const CreateContestModal = ({ isOpen, onClose, token, onContestCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'DSA',
    difficulty: 'Medium',
    startTime: getDefaultStartTime(),
    endTime: getDefaultEndTime(),
    maxParticipants: 150
  });

  const [includeProblem, setIncludeProblem] = useState(true);
  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    points: 100,
    type: 'CODING',
    correctAnswer: 'Optimal solution with O(N) complexity'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProblemChange = (e) => {
    const { name, value } = e.target;
    setProblemData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Contest title is required.');
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setErrorMsg('Both start time and end time are required.');
      return;
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setErrorMsg('End time must be after start time.');
      return;
    }

    setLoading(true);

    try {
      const authHeader = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // 1. Create Contest
      const contestPayload = {
        title: formData.title.trim(),
        description: formData.description.trim() || 'CampusIQ Competitive Programming Challenge',
        subject: formData.subject,
        difficulty: formData.difficulty,
        startTime: `${formData.startTime}:00`,
        endTime: `${formData.endTime}:00`,
        maxParticipants: parseInt(formData.maxParticipants, 10) || 100
      };

      const contestRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/contests`,
        contestPayload,
        authHeader
      );

      const createdContest = contestRes.data;

      // 2. Add Problem if provided
      if (includeProblem && problemData.title.trim()) {
        const probPayload = {
          title: problemData.title.trim(),
          description: problemData.description.trim() || 'Solve the given algorithm problem within time constraints.',
          points: parseInt(problemData.points, 10) || 100,
          type: problemData.type,
          correctAnswer: problemData.correctAnswer
        };

        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/contests/${createdContest.id}/problems`,
            probPayload,
            authHeader
          );
        } catch (probErr) {
          console.warn('Contest created, but error creating attached problem:', probErr);
        }
      }

      setSuccessMsg(`Contest "${createdContest.title}" created successfully!`);
      
      if (onContestCreated) {
        onContestCreated(createdContest);
      }

      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1200);

    } catch (err) {
      console.error('Failed to create contest:', err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      setErrorMsg(`Failed to create contest: ${serverMsg}`);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="modal-header-icon">🏆</div>
            <div>
              <h3>Create New Contest</h3>
              <p>Faculty Portal · Publish algorithmic challenge to campus</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div className="modal-alert error">
                <span>⚠️</span> {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="modal-alert success">
                <span>✅</span> {successMsg}
              </div>
            )}

            <div className="form-group">
              <label>Contest Title <span className="req">*</span></label>
              <input
                className="form-input"
                name="title"
                placeholder="e.g., Graph Algorithms Sprint & Shortest Path"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Subject / Domain</label>
                <select className="form-select" name="subject" value={formData.subject} onChange={handleChange}>
                  {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty Tier</label>
                <select className="form-select" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                  {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time <span className="req">*</span></label>
                <input
                  type="datetime-local"
                  className="form-input"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time <span className="req">*</span></label>
                <input
                  type="datetime-local"
                  className="form-input"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Max Participant Capacity</label>
              <input
                type="number"
                min="10"
                max="2000"
                className="form-input"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description & Learning Objectives</label>
              <textarea
                className="form-textarea"
                name="description"
                placeholder="Provide contest context, topics tested, rules and instructions for participants..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Problem Creator Section */}
            <div className="problem-toggle-section">
              <div className="problem-toggle-header" onClick={() => setIncludeProblem(!includeProblem)}>
                <h4>
                  <span>💻</span> Initial Problem Setup
                </h4>
                <input
                  type="checkbox"
                  checked={includeProblem}
                  onChange={(e) => setIncludeProblem(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {includeProblem && (
                <div className="problem-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Problem Title</label>
                      <input
                        className="form-input"
                        name="title"
                        placeholder="e.g. Dijkstra's Shortest Path Matrix"
                        value={problemData.title}
                        onChange={handleProblemChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Points</label>
                      <input
                        type="number"
                        min="10"
                        max="1000"
                        className="form-input"
                        name="points"
                        value={problemData.points}
                        onChange={handleProblemChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Problem Statement</label>
                    <textarea
                      className="form-textarea"
                      name="description"
                      placeholder="Given a graph represented by an adjacency matrix, find the shortest distance from node S to all other nodes."
                      value={problemData.description}
                      onChange={handleProblemChange}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Evaluation Type</label>
                      <select className="form-select" name="type" value={problemData.type} onChange={handleProblemChange}>
                        <option value="CODING">CODING (Automated Sandbox)</option>
                        <option value="MCQ">MCQ (Single Answer)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Expected Verification Answer</label>
                      <input
                        className="form-input"
                        name="correctAnswer"
                        placeholder="e.g. PriorityQueue O((V+E)logV)"
                        value={problemData.correctAnswer}
                        onChange={handleProblemChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Publishing Challenge...' : '🚀 Publish Contest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContestModal;
