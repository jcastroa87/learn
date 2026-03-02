"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import { getABCPuzzles } from "@/data/abc-puzzles";
import ABCPuzzleBoard from "@/components/activities/ABCPuzzleBoard";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ABCPuzzlesPage() {
  const { t } = useTranslation("activities");
  const { activeChild } = useChildProfile();
  const { records, fetchProgress, recordProgress } = useProgress(
    activeChild?.id ?? null
  );
  const { startTimer, getElapsedSeconds } = useActivityTimer();
  const { success, error: errorSound } = useAudio({
    soundEnabled: true,
    language: activeChild?.language || "es",
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [errors, setErrors] = useState(0);
  const [key, setKey] = useState(0);

  const lang = activeChild?.language || "es";
  const puzzles = useMemo(() => getABCPuzzles(lang), [lang]);
  const puzzle = puzzles[currentIndex];

  // Reset index when language changes (different alphabet size)
  useEffect(() => {
    setCurrentIndex(0);
    setKey((k) => k + 1);
  }, [lang]);

  const completedLetters = new Set(
    records.filter((r) => r.status === "completed").map((r) => r.item_identifier)
  );

  useEffect(() => {
    if (activeChild) fetchProgress("abc_puzzles");
  }, [activeChild, fetchProgress]);

  useEffect(() => {
    startTimer();
  }, [currentIndex, startTimer]);

  const handleCorrect = useCallback(async () => {
    success();
    setShowCelebration(true);

    if (!activeChild) return;
    const elapsed = getElapsedSeconds();
    await recordProgress("abc_puzzles", puzzle.letter, "completed", { errors }, elapsed);

    setTimeout(() => {
      if (currentIndex < puzzles.length - 1) {
        setCurrentIndex((i) => i + 1);
        setErrors(0);
        setKey((k) => k + 1);
      }
    }, 1500);
  }, [success, activeChild, getElapsedSeconds, recordProgress, puzzle.letter, errors, currentIndex, puzzles.length]);

  const handleWrong = useCallback(() => {
    errorSound();
    setErrors((e) => e + 1);
  }, [errorSound]);

  const handleLetterSelect = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setErrors(0);
    setKey((k) => k + 1);
  }, []);

  if (!activeChild) return <LoadingSpinner className="py-20" />;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
        {t("abc_puzzles")}
      </h1>

      <p className="text-gray-500 font-semibold text-sm mb-4">
        {currentIndex + 1} / {puzzles.length}
      </p>

      <ABCPuzzleBoard
        key={`${puzzle.letter}-${key}`}
        puzzle={puzzle}
        onCorrect={handleCorrect}
        onWrong={handleWrong}
      />

      {/* Letter progress strip */}
      <div className="flex gap-1.5 overflow-x-auto py-4 px-1 mt-4 no-scrollbar">
        {puzzles.map((p, i) => (
          <button
            key={p.letter}
            onClick={() => handleLetterSelect(i)}
            className={`w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all shrink-0 min-h-[44px] min-w-[44px] ${
              completedLetters.has(p.letter)
                ? "bg-gradient-to-b from-green-400 to-green-500 text-white shadow-sm"
                : currentIndex === i
                  ? "bg-white ring-2 ring-indigo-400 scale-110 shadow-md border border-gray-200"
                  : "bg-white text-gray-400 border border-gray-200"
            }`}
          >
            {p.letter}
          </button>
        ))}
      </div>

      <CelebrationOverlay
        show={showCelebration}
        message="⭐🎉⭐"
        onDone={() => setShowCelebration(false)}
      />
    </div>
  );
}
