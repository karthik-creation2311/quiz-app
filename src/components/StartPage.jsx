// StartPage.jsx
import "./css/StartPage.css";

const StartPage = ({ score, attempts, onStart, onShowScoreboard }) => {
  return (
    <>
      <div className="header">
        <h1>Quiz App</h1>
        <p>Beat the clock, beat the quiz</p>
      </div>
      <div className="score">
        <div className="yourScore">
          <h3>Your Score: {score}</h3>
          <button onClick={onShowScoreboard}>ScoreBoard</button>
        </div>
        <h3 className="attempt">Your Attempts: {attempts}</h3>
      </div>
      <div className="start">
        <button onClick={onStart}>
          <img src="/play.svg" alt="play_icon" />
        </button>
        <p>Start the Quiz</p>
      </div>
    </>
  );
};

export default StartPage;