// QuizQuestion.jsx
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import './css/QuizQuestion.css';

const QuizQuestion = ({ onQuizComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizHistory, setQuizHistory] = useState([]);
  const [db, setDb] = useState(null);

  const questions = [
    {
      questionText: 'Which planet is closest to the Sun?',
      answerOptions: [
        { answerText: 'Venus', isCorrect: false },
        { answerText: 'Mercury', isCorrect: true },
        { answerText: 'Earth', isCorrect: false },
        { answerText: 'Mars', isCorrect: false },
      ],
    },
    {
      questionText: 'Which data structure organizes items in a First-In, First-Out (FIFO) manner?',
      answerOptions: [
        { answerText: 'Stack', isCorrect: false },
        { answerText: 'Queue', isCorrect: true },
        { answerText: 'Tree', isCorrect: false },
        { answerText: 'Graph', isCorrect: false },
      ],
    },
    {
      questionText: 'Which of the following is primarily used for structuring web pages?',
      answerOptions: [
        { answerText: 'Python', isCorrect: false },
        { answerText: 'Java', isCorrect: false },
        { answerText: 'HTML', isCorrect: true },
        { answerText: 'C++', isCorrect: false },
      ],
    },
    {
      questionText: 'Which chemical symbol stands for Gold?',
      answerOptions: [
        { answerText: 'Au', isCorrect: true },
        { answerText: 'Gd', isCorrect: false },
        { answerText: 'Ag', isCorrect: false },
        { answerText: 'Pt', isCorrect: false },
      ],
    },
    {
      questionText: 'Which of these processes is not typically involved in refining petroleum?',
      answerOptions: [
        { answerText: 'Fractional distillation', isCorrect: false },
        { answerText: 'Cracking', isCorrect: false },
        { answerText: 'Polymerization', isCorrect: false },
        { answerText: 'Filtration', isCorrect: true },
      ],
    },
    {
      questionText: 'What is the value of 12 + 28?',
      answerOptions: [
        { answerText: '38', isCorrect: false },
        { answerText: '39', isCorrect: false },
        { answerText: '40', isCorrect: true },
        { answerText: '41', isCorrect: false },
      ],
    },
    {
      questionText: 'How many states are there in the United States?',
      answerOptions: [
        { answerText: '48', isCorrect: false },
        { answerText: '49', isCorrect: false },
        { answerText: '50', isCorrect: true },
        { answerText: '51', isCorrect: false },
      ],
    },
    {
      questionText: 'In which year was the Declaration of Independence signed?',
      answerOptions: [
        { answerText: '1774', isCorrect: false },
        { answerText: '1775', isCorrect: false },
        { answerText: '1776', isCorrect: true },
        { answerText: '1777', isCorrect: false },
      ],
    },
    {
      questionText: 'What is the value of pi rounded to the nearest integer?',
      answerOptions: [
        { answerText: '2', isCorrect: false },
        { answerText: '3', isCorrect: true },
        { answerText: '4', isCorrect: false },
        { answerText: '5', isCorrect: false },
      ],
    },
    {
      questionText: 'If a car travels at 60 mph for 2 hours, how many miles does it travel?',
      answerOptions: [
        { answerText: '100', isCorrect: false },
        { answerText: '110', isCorrect: false },
        { answerText: '120', isCorrect: true },
        { answerText: '130', isCorrect: false },
      ],
    },
  ];

  // Database initialization useEffect remains the same
  useEffect(() => {
    const request = indexedDB.open('QuizDatabase', 1);

    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('quizHistory')) {
        db.createObjectStore('quizHistory', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      setDb(event.target.result);
    };
  }, []);

  // Timer useEffect remains the same
  useEffect(() => {
    if (timeLeft > 0 && !showScore) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showScore) {
      handleAnswerClick(false);
    }
  }, [timeLeft, showScore]);

  const saveQuizResult = (score) => {
    if (db) {
      const transaction = db.transaction(['quizHistory'], 'readwrite');
      const store = transaction.objectStore('quizHistory');
      const result = {
        date: new Date().toISOString(),
        score: score,
        totalQuestions: questions.length,
      };
      store.add(result);
    }
  };

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(30);
    } else {
      setShowScore(true);
      saveQuizResult(score);
      if (onQuizComplete) {
        onQuizComplete(score);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setTimeLeft(30);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h2 className="quiz-title">Interactive Quiz</h2>
        </div>
        <div className="quiz-content">
          {showScore ? (
            <div className="score-container">
              <h2>Quiz Complete!</h2>
              <p>You scored {score} out of {questions.length}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(score / questions.length) * 100}%` }}
                ></div>
              </div>
              <button className="restart-button" onClick={restartQuiz}>
                Restart Quiz
              </button>
            </div>
          ) : (
            <div>
              <div className="quiz-status">
                <span>Question {currentQuestion + 1}/{questions.length}</span>
                <div className="timer">
                  <Timer className="timer-icon" />
                  <span>{timeLeft}s</span>
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                ></div>
              </div>
              <h3 className="question-text">{questions[currentQuestion].questionText}</h3>
              <div className="answer-grid">
                {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(answerOption.isCorrect)}
                    className="answer-button"
                  >
                    {answerOption.answerText}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;