
import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './components/Board';
import DifficultySelector from './components/DifficultySelector';
import './styles/Button.css'

const EMPTY = '';
const PLAYER_X = 'X';
const PLAYER_O = 'O';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(EMPTY));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');

  const checkWinner = (board) => {     // Winning Pattern
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every(cell => cell !== EMPTY)) {
      return 'draw';
    }

    return null;
  };

  const handleCellClick = (index) => {                  // Cell click handler

    if (board[index] === EMPTY && !winner && !isDraw && currentPlayer === PLAYER_X) {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      const winner = checkWinner(newBoard);
      if (winner === 'draw') {
        setIsDraw(true);
      } else if (winner) {
        setWinner(winner);
      } else {
        setCurrentPlayer(PLAYER_O);
      }
    }
  };
  
  useEffect(() => {                          // Effect for computer's move
  
    if (currentPlayer === PLAYER_O && !winner && !isDraw) {
      setTimeout(() => {
        makeComputerMove([...board]);
      }, 500);
    }
  }, [currentPlayer, winner, isDraw, board]);

  const makeComputerMove = (currentBoard) => {        // Computer moves
   
    const availableMoves = currentBoard.reduce((acc, cell, index) => {
      if (cell === EMPTY) {
        return acc.concat(index);
      }
      return acc;
    }, []);

    let nextMove;
    switch (difficulty) {
      case 'easy':
        nextMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        break;
      case 'medium':
        nextMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        break;
      case 'hard':
        nextMove = getBestMove(currentBoard, currentPlayer).index;
        break;
      default:
        nextMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        break;
    }

    const newBoard = [...currentBoard];
    newBoard[nextMove] = currentPlayer;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner === 'draw') {
      setIsDraw(true);
    } else if (winner === PLAYER_O) {
      setWinner(winner);
    } else {
      setCurrentPlayer(PLAYER_X);
    }
  };

  const getBestMove = (board, player) => {      // Minimax algorithm

 
    const maximizer = PLAYER_O;
    const minimizer = PLAYER_X;

    const maxDepth = 9 - board.filter(cell => cell !== EMPTY).length;

    const minimax = (currentBoard, depth, isMaximizingPlayer, alpha, beta) => {
      const winner = checkWinner(currentBoard);
      if (winner === PLAYER_O) {
        return 10 - depth;
      } else if (winner === PLAYER_X) {
        return depth - 10;
      } else if (winner === 'draw') {
        return 0;
      }

      if (depth === maxDepth) {
        return 0;
      }

      if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        let bestMove;
        for (let i = 0; i < currentBoard.length; i++) {
          if (currentBoard[i] === EMPTY) {
            const newBoard = [...currentBoard];
            newBoard[i] = maximizer;
            const score = minimax(newBoard, depth + 1, false, alpha, beta);
            if (score > bestScore) {
              bestScore = score;
              bestMove = i;
            }
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) {
              break;
            }
          }
        }
        return depth === 0 ? { score: bestScore, index: bestMove } : bestScore;
      } else {
        let bestScore = Infinity;
        let bestMove;
        for (let i = 0; i < currentBoard.length; i++) {
          if (currentBoard[i] === EMPTY) {
            const newBoard = [...currentBoard];
            newBoard[i] = minimizer;
            const score = minimax(newBoard, depth + 1, true, alpha, beta);
            if (score < bestScore) {
              bestScore = score;
              bestMove = i;
            }
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) {
              break;
            }
          }
        }
        return depth === 0 ? { score: bestScore, index: bestMove } : bestScore;
      }
    };

    return minimax(board, 0, true, -Infinity, Infinity);
  };

  const resetGame = () => {   // Reset game
   
    setBoard(Array(9).fill(EMPTY));
    setCurrentPlayer(PLAYER_X);
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <Board board={board} handleCellClick={handleCellClick} />
      {(winner || isDraw) && (
        <div>
          <h2>{winner === 'draw' ? "It's a draw!" : (winner === PLAYER_O ? "Computer wins!" : "Player wins!")}</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
      {!winner && !isDraw && currentPlayer === PLAYER_O && (
        <p>Computer is thinking...</p>
      )}
      <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
    </div>
  );
};

export default App;