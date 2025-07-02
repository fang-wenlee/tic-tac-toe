"use client";
import React, { useState } from "react";
// Import shadcn/ui Button for styling
import { Button } from "@/components/ui/button";

const emptyBoard = Array(9).fill(null);
const PLAYER_OPTIONS = ["🐶", "🦴", "🐱", "🐟", "🐰", "🐵", "🍌", "🥕", "🚗", "🦄"];

export default function TicTacToe() {
  const [playerX, setPlayerX] = useState(PLAYER_OPTIONS[0]);
  const [playerO, setPlayerO] = useState(PLAYER_OPTIONS[1]);
  const [squares, setSquares] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [emojiError, setEmojiError] = useState("");
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winnerLine = winnerInfo ? winnerInfo.line : [];

  // Initialize scores for selected players
  React.useEffect(() => {
    setScore({ [playerX]: 0, [playerO]: 0 });
  }, [playerX, playerO]);

  function handleClick(i) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? playerX : playerO;
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    if (winner) {
      setScore((prev) => ({ ...prev, [winner]: (prev[winner] || 0) + 1 }));
    }
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
    status = `Player: ${xIsNext ? playerX : playerO}'s turn`;
  }

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8">Tic Tac Toe</h1>
        <h3 className="mb-8">Select your emoji and start the game!</h3>
        <div className="flex gap-12 mb-8">
          <div className="flex flex-col items-center">
            <span className="mb-2 font-semibold">Player 1</span>
            <select className="text-3xl p-2 rounded" value={playerX} onChange={e => { setPlayerX(e.target.value); setEmojiError(""); }}>
              {PLAYER_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-2 font-semibold">Player 2</span>
            <select className="text-3xl p-2 rounded" value={playerO} onChange={e => { setPlayerO(e.target.value); setEmojiError(""); }}>
              {PLAYER_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        {emojiError && <div className="text-red-600 font-semibold mb-4">{emojiError}</div>}
        <Button className="bg-blue-600 text-white px-6 py-3 rounded text-lg" onClick={() => {
          if (playerX === playerO) {
            setEmojiError("Players must select different emojis!");
            return;
          }
          setGameStarted(true);
        }}>
          Start Game
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${winner ? "bg-blue-200 transition-colors duration-500" : ""}`}>
      <h1 className="text-4xl font-bold mb-8">Tic Tac Toe</h1>
      <h3 className="mb-8">Challenge your friends in this classic game!</h3>
      <div className="flex flex-row items-center justify-center w-full">
        {/* Left: Tic Tac Toe Board */}
        <div className="mr-12">
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
        </div>
        {/* Right: Scoreboard, Status, Buttons */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              <span className={`text-2xl ${score[playerX] > score[playerO] ? "animate-zoom" : ""}`}>{playerX}</span>
              <span className="text-lg font-semibold">{score[playerX] || 0}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-2xl ${score[playerO] > score[playerX] ? "animate-zoom" : ""}`}>{playerO}</span>
              <span className="text-lg font-semibold">{score[playerO] || 0}</span>
            </div>
          </div>
          <div className="text-lg font-medium mb-2">{status}</div>
          <div className="flex gap-4">
            <Button className="bg-black hover:bg-blue-800 text-white px-4 py-2 rounded" onClick={handleReset} variant="default">
              New Game
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white text-white px-4 py-2 rounded" onClick={() => {
              setScore({ [playerX]: 0, [playerO]: 0 });
              setSquares(emptyBoard);
              setXIsNext(true);
              setGameStarted(false); // Enable emoji change after Reset All
            }} variant="default">
              Reset All
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}

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
