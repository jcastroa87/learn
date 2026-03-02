"use client";

import { useState, useCallback, useMemo } from "react";
import type { MatchPair } from "@/data/matching";

interface MatchingBoardProps {
  pairs: MatchPair[];
  language: string;
  onMatch: (pair: MatchPair) => void;
  onError: () => void;
  onComplete: (errorCount: number) => void;
}

export default function MatchingBoard({
  pairs,
  language,
  onMatch,
  onError,
  onComplete,
}: MatchingBoardProps) {
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [animating, setAnimating] = useState(false);

  const shuffledRight = useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5),
    [pairs]
  );

  const handleLeftTap = useCallback(
    (id: string) => {
      if (animating || matchedIds.has(id)) return;
      setSelectedLeft(id);

      if (selectedRight) {
        setAnimating(true);
        if (selectedRight === id) {
          // Match!
          const pair = pairs.find((p) => p.id === id);
          setMatchedIds((prev) => new Set([...prev, id]));
          if (pair) onMatch(pair);
          setSelectedLeft(null);
          setSelectedRight(null);

          const newMatched = matchedIds.size + 1;
          if (newMatched === pairs.length) {
            setTimeout(() => onComplete(errorCount), 300);
          }
          setTimeout(() => setAnimating(false), 300);
        } else {
          // Mismatch
          setErrorCount((e) => e + 1);
          onError();
          setTimeout(() => {
            setSelectedLeft(null);
            setSelectedRight(null);
            setAnimating(false);
          }, 600);
        }
      }
    },
    [animating, matchedIds, selectedRight, pairs, onMatch, onError, onComplete, errorCount]
  );

  const handleRightTap = useCallback(
    (id: string) => {
      if (animating || matchedIds.has(id)) return;
      setSelectedRight(id);

      if (selectedLeft) {
        setAnimating(true);
        if (selectedLeft === id) {
          const pair = pairs.find((p) => p.id === id);
          setMatchedIds((prev) => new Set([...prev, id]));
          if (pair) onMatch(pair);
          setSelectedLeft(null);
          setSelectedRight(null);

          const newMatched = matchedIds.size + 1;
          if (newMatched === pairs.length) {
            setTimeout(() => onComplete(errorCount), 300);
          }
          setTimeout(() => setAnimating(false), 300);
        } else {
          setErrorCount((e) => e + 1);
          onError();
          setTimeout(() => {
            setSelectedLeft(null);
            setSelectedRight(null);
            setAnimating(false);
          }, 600);
        }
      }
    },
    [animating, matchedIds, selectedLeft, pairs, onMatch, onError, onComplete, errorCount]
  );

  // Get translated right label
  function getRightLabel(pair: MatchPair): string {
    if (pair.ttsText && pair.ttsText[language]) {
      return pair.ttsText[language];
    }
    return pair.right;
  }

  return (
    <div className="flex gap-6 justify-center">
      <div className="flex flex-col gap-3">
        {pairs.map((pair) => (
          <button
            key={`l-${pair.id}`}
            onClick={() => handleLeftTap(pair.id)}
            disabled={matchedIds.has(pair.id)}
            className={`w-20 h-16 rounded-xl text-3xl font-bold flex items-center justify-center transition-all min-h-[44px] ${
              matchedIds.has(pair.id)
                ? "bg-emerald-100 text-emerald-600 opacity-60"
                : selectedLeft === pair.id
                ? "bg-blue-200 ring-2 ring-blue-500 scale-105"
                : "bg-white border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {pair.left}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {shuffledRight.map((pair) => (
          <button
            key={`r-${pair.id}`}
            onClick={() => handleRightTap(pair.id)}
            disabled={matchedIds.has(pair.id)}
            className={`w-24 h-16 rounded-xl text-sm font-medium flex items-center justify-center transition-all min-h-[44px] ${
              matchedIds.has(pair.id)
                ? "bg-emerald-100 text-emerald-600 opacity-60"
                : selectedRight === pair.id
                ? "bg-blue-200 ring-2 ring-blue-500 scale-105"
                : "bg-white border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            {getRightLabel(pair)}
          </button>
        ))}
      </div>
    </div>
  );
}
