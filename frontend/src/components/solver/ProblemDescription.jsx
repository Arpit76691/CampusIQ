import React from 'react';

const ProblemDescription = ({ problem, contest }) => {
  if (!problem) {
    return (
      <div className="problem-loading">
        <p>Loading problem description...</p>
      </div>
    );
  }

  // Sample test cases for problem (dynamic from problem bank or fallback)
  const sampleTestcases = (problem.examples && problem.examples.length > 0)
    ? problem.examples
    : [
        {
          id: 1,
          input: 'nums = [2, 7, 11, 15], target = 9',
          output: '[0, 1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        },
        {
          id: 2,
          input: 'nums = [3, 2, 4], target = 6',
          output: '[1, 2]',
          explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
        },
      ];

  const constraintsList = (problem.constraints && problem.constraints.length > 0)
    ? problem.constraints
    : [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.'
      ];

  const difficultyClass = (problem.difficulty || 'Medium').toLowerCase();

  return (
    <div className="problem-description-container">
      <div className="problem-meta-tags">
        <span className={`tag-difficulty ${difficultyClass}`}>{problem.difficulty || 'Medium'}</span>
        <span className="tag-points">★ {problem.points || 100} Points</span>
        <span className="tag-subject">{problem.category || contest?.subject || 'Algorithms'}</span>
      </div>

      <h1 className="problem-title">{problem.title || 'Two Sum Problem'}</h1>

      <div className="problem-section">
        <h3>Description</h3>
        <p className="problem-text" style={{ whiteSpace: 'pre-line' }}>
          {problem.description ||
            'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'}
        </p>
      </div>

      <div className="problem-section">
        <h3>Examples</h3>
        {sampleTestcases.map((tc, idx) => (
          <div key={tc.id || idx} className="example-box">
            <div className="example-header">Example {idx + 1}</div>
            <div className="example-body">
              <div className="example-row">
                <span className="label">Input:</span>
                <code>{tc.input}</code>
              </div>
              <div className="example-row">
                <span className="label">Output:</span>
                <code>{tc.output}</code>
              </div>
              {tc.explanation && (
                <div className="example-row">
                  <span className="label">Explanation:</span>
                  <span>{tc.explanation}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="problem-section">
        <h3>Constraints</h3>
        <ul className="constraints-list">
          {constraintsList.map((c, i) => (
            <li key={i}><code>{c}</code></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemDescription;
