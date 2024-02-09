import React from 'react';
import Cell from './Cell';
import '../styles/Board.css'

const Board = ({ board, handleCellClick }) => {
  return (
    <div className="board">
      {board.map((cell, index) => (
        <Cell key={index} value={cell} onClick={() => handleCellClick(index)} />
      ))}
    </div>
  );
};

export default Board;