import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './components/Board';
import DifficultySelector from './components/DifficultySelector';
import './styles/Button.css';

const EMPTY = '';             // our constants 
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
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6],
      [3, 4, 5],
      [6, 7, 8],
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition;                   //a,b,c are indices 
      if ( ( board[a] ) && ( board[a] === board[b] && board[a] === board[c] ) ) {
        return board[a];
      }

    }

    if (board.every(cell => cell !== EMPTY)) {  // If every cell is filled, it is draw
      return 'draw';
    }

    return null;     // when winner and draw condition is not matched, returning null
  };

// function, trigged when user(player X) clicking on any cell
  const handleCellClick = (index) => {          
    if (board[index] === EMPTY && !winner && !isDraw && currentPlayer === PLAYER_X) {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const winner = checkWinner(newBoard); // call checkWinner with updated board
      console.log('Winner:', winner); 

      if (winner === 'draw') {
        setIsDraw(true);
      } 
      else if (winner) {
        setWinner(winner);
      } else {
        setCurrentPlayer(PLAYER_O);
      }
    }
  };

   // effect for computer's move
  useEffect(() => {                         
    if (currentPlayer === PLAYER_O && !winner && !isDraw) {
      setTimeout(() => {
        makeComputerMove([...board]);
      }, 500);
    }
  }, [currentPlayer, winner, isDraw, board]);


//  function for Computer moves
  const makeComputerMove = (currentBoard) => {        

    const availableMoves = currentBoard.reduce((acc, cell, index) => {  
      if (cell === EMPTY) {                
        return acc.concat(index);      
      }
      return acc;           // returning array of empty cells
    }, []);

    let nextMove;  // nextMove stores random index(of availMOVES ARRAY) according to the selected difficulty level by user
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

    const newBoard = [...currentBoard];  // updating board
    newBoard[nextMove] = currentPlayer;
    setBoard(newBoard);

    const winner = checkWinner(newBoard); // call checkWinner with updated board
    if (winner === 'draw') {
      setIsDraw(true);
    } else if (winner === PLAYER_O) {
      setWinner(winner);
    } else {
      setCurrentPlayer(PLAYER_X);
    }
  };

  //function, to  get best Move for computer in hard mode
  const getBestMove = (board, player) => {      // Minimax algorithm is used
    const maximizer = PLAYER_O;
    const minimizer = PLAYER_X;

    const maxDepth = 9 - board.filter(cell => cell !== EMPTY).length;

    // recursive function used to  evaluates the best move for the current player
    const minimax = (currentBoard, depth, isMaximizingPlayer, alpha, beta) => {
     
      const winner = checkWinner(currentBoard);
      //base cases
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

      if (isMaximizingPlayer) {       // Maximizing player (computer)
        let bestScore = -Infinity;
        let bestMove;
        for (let i = 0; i < currentBoard.length; i++) {
          if (currentBoard[i] === EMPTY) {
            const newBoard = [...currentBoard];
            newBoard[i] = maximizer;   // maximizer player O

           const score = minimax(newBoard, depth + 1, false, alpha, beta); // Recursive call minimax with the new board
            if (score > bestScore) {
              bestScore = score;
              bestMove = i;
            }
            alpha = Math.max(alpha, bestScore);  // updating Alpha
            if (beta <= alpha) { // if  beta  becomes <= alpha , it means that this  path is not good enough 
              break;
            }
          }
        }
        return depth === 0 ? { score: bestScore, index: bestMove } : bestScore;
      }   
        else {                    // Minimizing player (human)
        let bestScore = Infinity;
        let bestMove;
        for (let i = 0; i < currentBoard.length; i++) {
          if (currentBoard[i] === EMPTY) {
            const newBoard = [...currentBoard];
            newBoard[i] = minimizer;
            const score = minimax(newBoard, depth + 1, true, alpha, beta); // minimax recursive call
            if (score < bestScore) {
              bestScore = score;
              bestMove = i;
            }
            beta = Math.min(beta, bestScore); //update Beta
            if (beta <= alpha) {
              break;
            }
          }
        }
        //return move with its depth score
        return depth === 0 ? { score: bestScore, index: bestMove } : bestScore; 
      }
    };

   //  it calls the minimax function with the initial parameters to start the recursive process(for best move)
    return minimax(board, 0, true, -Infinity, Infinity);
  };

  //function to Reset game,trigged when user clicks play again button
  const resetGame = () => {   
    setBoard(Array(9).fill(EMPTY));
    setCurrentPlayer(PLAYER_X);
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>

      <Board board={board} handleCellClick={handleCellClick} />  

      {(isDraw) && (
        <div>
          <h2>It's a draw!</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
      {winner && (
        <div>
          <h2>{winner === PLAYER_O ? "Player O wins!" : "Player X wins!"}</h2>
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
