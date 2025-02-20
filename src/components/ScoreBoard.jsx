import React, { useState, useEffect } from 'react';
import './css/ScoreBoard.css';

const ScoreBoard = ({ onBack }) => {
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    const request = indexedDB.open('QuizDatabase', 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['quizHistory'], 'readonly');
      const store = transaction.objectStore('quizHistory');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        setQuizHistory(getAllRequest.result);
      };
    };

    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const calculatePerformance = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'average';
    return 'needs-improvement';
  };

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-card">
        <div className="scoreboard-header">
          <h2>Quiz History</h2>
          <button className="back-button" onClick={onBack}>Back to Start</button>
        </div>

        <div className="stats-summary">
          <div className="stat-item">
            <h3>Total Attempts</h3>
            <p>{quizHistory.length}</p>
          </div>
          <div className="stat-item">
            <h3>Average Score</h3>
            <p>
              {quizHistory.length > 0
                ? (
                    quizHistory.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) /
                    quizHistory.length
                  ).toFixed(1) + '%'
                : '0%'}
            </p>
          </div>
          <div className="stat-item">
            <h3>Best Score</h3>
            <p>
              {quizHistory.length > 0
                ? Math.max(...quizHistory.map(h => (h.score / h.totalQuestions) * 100)).toFixed(1) + '%'
                : '0%'}
            </p>
          </div>
        </div>

        {quizHistory.length > 0 ? (
          <div className="scoreboard-table-container">
            <table className="scoreboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Questions</th>
                  <th>Score</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((record, index) => (
                  <tr key={index}>
                    <td>{formatDate(record.date)}</td>
                    <td>{formatTime(record.date)}</td>
                    <td>{record.totalQuestions}</td>
                    <td>{record.score} / {record.totalQuestions}</td>
                    <td>
                      <span className={`performance-badge ${calculatePerformance(record.score, record.totalQuestions)}`}>
                        {calculatePerformance(record.score, record.totalQuestions).replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <p>No quiz attempts yet. Start taking quizzes to see your history!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreBoard;
