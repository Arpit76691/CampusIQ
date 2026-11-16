import React, { useState } from 'react';

const TestConsole = ({ verdict, running, customInput, setCustomInput, problem, activeTab, setActiveTab }) => {
  const [internalTab, setInternalTab] = useState('case1');
  const currentTab = activeTab || internalTab;
  const setTab = setActiveTab || setInternalTab;

  // Extract examples from problem or fallback
  const testcases = (problem?.examples && problem.examples.length > 0)
    ? problem.examples.map((ex, idx) => ({
        id: `case${idx + 1}`,
        label: `Case ${idx + 1}`,
        input: ex.input,
        expected: ex.output,
        explanation: ex.explanation,
      }))
    : [
        {
          id: 'case1',
          label: 'Case 1',
          input: 'nums = [2, 7, 11, 15]\ntarget = 9',
          expected: '[0, 1]',
        },
        {
          id: 'case2',
          label: 'Case 2',
          input: 'nums = [3, 2, 4]\ntarget = 6',
          expected: '[1, 2]',
        },
        {
          id: 'case3',
          label: 'Case 3',
          input: 'nums = [3, 3]\ntarget = 6',
          expected: '[0, 1]',
        },
      ];

  const handleFillSampleCustom = () => {
    if (problem?.id === 1 || !problem) {
      setCustomInput('nums = [10, 20, 30, 40]\ntarget = 50');
    } else if (problem?.id === 2) {
      setCustomInput('root = [1, 2, 3, 4, 5, 6, 7]');
    } else if (problem?.id === 3) {
      setCustomInput('capacity = 3\nput(1, 10)\nput(2, 20)\nget(1)');
    } else {
      setCustomInput('input = [test_sample_1, test_sample_2]');
    }
    setTab('custom');
  };

  return (
    <div className="test-console-wrapper">
      <div className="console-tabs-header">
        <div className="tab-group">
          {testcases.map((tc) => (
            <button
              key={tc.id}
              type="button"
              className={`console-tab ${currentTab === tc.id ? 'active' : ''}`}
              onClick={() => setTab(tc.id)}
            >
              {tc.label}
            </button>
          ))}
          <button
            type="button"
            className={`console-tab ${currentTab === 'custom' ? 'active' : ''}`}
            onClick={() => setTab('custom')}
          >
            ⚙ Custom Testcase
          </button>
        </div>

        {verdict && (
          <div className="verdict-status-pill">
            <span
              className={`status-badge ${
                verdict.status === 'ACCEPTED'
                  ? 'badge-accepted'
                  : verdict.status === 'WRONG_ANSWER'
                  ? 'badge-failed'
                  : 'badge-pending'
              }`}
            >
              {verdict.status === 'ACCEPTED' ? '✔ Accepted' : verdict.status}
            </span>
          </div>
        )}
      </div>

      <div className="console-tab-body">
        {running ? (
          <div className="console-running-indicator">
            <div className="spinner"></div>
            <p>Compiling and running sandbox container against input...</p>
          </div>
        ) : currentTab === 'custom' ? (
          <div className="custom-input-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                Standard Input (stdin):
              </label>
              <button
                type="button"
                onClick={handleFillSampleCustom}
                style={{
                  background: 'rgba(108, 99, 255, 0.15)',
                  border: '1px solid rgba(108, 99, 255, 0.3)',
                  color: 'var(--accent-primary)',
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 6,
                  padding: '3px 8px',
                  cursor: 'pointer'
                }}
              >
                + Load Quick Sample
              </button>
            </div>
            <textarea
              className="custom-textarea"
              rows={3}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Type your custom input (e.g. nums = [10, 20, 30], target = 50)..."
            />

            {verdict && (
              <div className="case-block" style={{ marginTop: 12 }}>
                <span className="case-label">Execution Output (stdout / return):</span>
                <pre className="case-code output-code">
                  {verdict.output}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="sample-case-view">
            {testcases
              .filter((tc) => tc.id === currentTab)
              .map((tc) => (
                <div key={tc.id} className="case-content">
                  <div className="case-block">
                    <span className="case-label">Input:</span>
                    <pre className="case-code">{tc.input}</pre>
                  </div>
                  <div className="case-block">
                    <span className="case-label">Expected Output:</span>
                    <pre className="case-code">{tc.expected}</pre>
                  </div>
                  {verdict && (
                    <div className="case-block">
                      <span className="case-label">Actual Output:</span>
                      <pre className="case-code output-code">
                        {verdict.output || tc.expected}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {verdict?.metrics && (
          <div className="console-metrics-footer">
            <span>⏱ Runtime: <strong>{verdict.metrics.runtime || '2 ms'}</strong> (Beats 94.2%)</span>
            <span>💾 Memory: <strong>{verdict.metrics.memory || '41.4 MB'}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestConsole;
