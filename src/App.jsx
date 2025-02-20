import { useEffect, useState } from "react";
import StartPage from "./components/StartPage";
import QuizQuestion from "./components/QuizQuestion";
import ScoreBoard from "./components/ScoreBoard";
import React from "react";

function App() {
  const [currentView, setCurrentView] = useState("start"); // 'start', 'quiz', or 'scoreboard'
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);

  // Function to fetch updated quiz history from IndexedDB
  const fetchQuizHistory = () => {
    const request = indexedDB.open("QuizDatabase", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["quizHistory"], "readonly");
      const store = transaction.objectStore("quizHistory");
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        setQuizHistory(getAllRequest.result);
      };
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
    };
  };

  // Fetch quiz history on mount
  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const handleStartQuiz = () => {
    setCurrentView("quiz");
  };

  const handleShowScoreboard = () => {
    setCurrentView("scoreboard");
  };

  const handleBackToStart = () => {
    setCurrentView("start");
    fetchQuizHistory(); // Fetch updated history when returning to StartPage
  };

  const handleQuizComplete = (newScore) => {
    setScore(newScore);
    setAttempts((prev) => prev + 1);
    fetchQuizHistory(); // Fetch updated history after quiz is completed
    setCurrentView("start");
  };

  return (
    <>
      {currentView === "quiz" && <QuizQuestion onQuizComplete={handleQuizComplete} />}
      {currentView === "scoreboard" && <ScoreBoard onBack={handleBackToStart} />}
      {currentView === "start" && (
        <StartPage
          score={quizHistory.reduce((acc, quiz) => acc + quiz.score, 0)} // Updated total score
          attempts={quizHistory.length} // Updated attempts count
          onStart={handleStartQuiz}
          onShowScoreboard={handleShowScoreboard}
        />
      )}
    </>
  );
}

export default App;
