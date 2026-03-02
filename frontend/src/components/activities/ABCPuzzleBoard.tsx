"use client";

import { useState, useCallback, useMemo } from "react";
import type { ABCPuzzle } from "@/data/abc-puzzles";
import { getShuffledOptions } from "@/data/abc-puzzles";

interface ABCPuzzleBoardProps {
  puzzle: ABCPuzzle;
  onCorrect: () => void;
  onWrong: () => void;
}

export default function ABCPuzzleBoard({
  puzzle,
  onCorrect,
  onWrong,
}: ABCPuzzleBoardProps) {
  const [answered, setAnswered] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [wrongLetter, setWrongLetter] = useState<string | null>(null);

  const options = useMemo(() => getShuffledOptions(puzzle), [puzzle]);

  const handleSelect = useCallback(
    (letter: string) => {
      if (answered) return;

      setSelectedLetter(letter);

      if (letter === puzzle.letter) {
        setAnswered(true);
        onCorrect();
      } else {
        setWrongLetter(letter);
        onWrong();
        setTimeout(() => setWrongLetter(null), 600);
        setSelectedLetter(null);
      }
    },
    [answered, puzzle.letter, onCorrect, onWrong]
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      {/* Image and word display */}
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full text-center border-2 border-indigo-100">
        <div className="text-8xl mb-4 animate-bounce-in">{puzzle.image}</div>
        <div className="text-3xl font-extrabold text-gray-800 tracking-wide">
          <span className={`inline-block ${answered ? "text-green-500" : "text-indigo-400"} transition-colors`}>
            {answered ? puzzle.letter : "?"}
          </span>
          <span>{puzzle.word.slice(1)}</span>
        </div>
      </div>

      {/* Letter options */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {options.map((letter) => {
          let style =
            "bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 shadow-md";

          if (answered && letter === puzzle.letter) {
            style =
              "bg-gradient-to-b from-green-400 to-green-500 border-2 border-green-400 text-white shadow-lg shadow-green-500/30 scale-110";
          } else if (wrongLetter === letter) {
            style =
              "bg-gradient-to-b from-red-400 to-red-500 border-2 border-red-400 text-white shadow-lg shadow-red-500/30 animate-wiggle";
          }

          return (
            <button
              key={letter}
              onClick={() => handleSelect(letter)}
              disabled={answered}
              className={`rounded-2xl py-5 text-4xl font-extrabold transition-all min-h-[80px] btn-3d ${style}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
