"use client";
import { useState } from "react";
// Import shadcn/ui Button for styling
import { Button } from "@/components/ui/button";

const emptyBoard = Array(9).fill(null);
const PLAYER_X = "🐶";
const PLAYER_O = "🦴";

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function TicTacToe() {
  const [squares, setSquares] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winnerLine = winnerInfo ? winnerInfo.line : [];

  function handleClick(i) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? PLAYER_X : PLAYER_O;
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setSquares(emptyBoard);
    setXIsNext(true);
  }

  function renderSquare(i) {
    const isWinner = winnerLine.includes(i);
    return (
      <Button
        variant="outline"
        className={`w-16 h-16 text-2xl font-bold flex items-center justify-center transition-transform duration-500 ${isWinner ? "bg-blue-500 text-white" : ""}`}
        onClick={() => handleClick(i)}
      >
        <span className={`inline-block transition-transform duration-500 ${isWinner ? "animate-zoom" : "scale-100"}`}>
          {squares[i]}
        </span>
      </Button>
    );
  }

  let status;
  if (winner) {

    status = `Winner: ${winner}`;
  } else if (squares.every(Boolean)) {
    status = "Draw!";
  } else {
    status = `Next player: ${xIsNext ? PLAYER_X : PLAYER_O}`;
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${winner ? "bg-blue-200 transition-colors duration-500" : ""}`}>
      <h1 className="text-3xl font-bold mb-4">Tic Tac Toe</h1>
      <div className="mb-4">
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-2">
              {[0, 1, 2].map((col) => (
                <div key={col}>{renderSquare(row * 3 + col)}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4 text-lg font-medium">{status}</div>
      <Button onClick={handleReset} variant="default">
        Reset
      </Button>
    </div>
  );
}
