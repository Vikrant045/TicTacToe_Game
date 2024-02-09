import React from 'react';
import "../styles/DifficultySelector.css"

const DifficultySelector = ({ difficulty, setDifficulty }) => {
  return (
    <div className="difficulty-container">
      <label htmlFor="difficulty">Select Difficulty:</label>
      <select
        id="difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
};

export default DifficultySelector;