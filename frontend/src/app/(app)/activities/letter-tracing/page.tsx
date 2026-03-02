"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import { getLetters } from "@/data/waypoints/letters";
import LetterPicker from "@/components/activities/LetterPicker";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const TracingCanvas = dynamic(() => import("@/components/canvas/TracingCanvas"), { ssr: false });

export default function LetterTracingPage() {
  const { t } = useTranslation("activities");
  const { activeChild } = useChildProfile();
  const { records, fetchProgress, recordProgress } = useProgress(
    activeChild?.id ?? null
  );
  const { startTimer, getElapsedSeconds } = useActivityTimer();
  const { success, tap } = useAudio({
    soundEnabled: true,
    language: activeChild?.language || "es",
  });

  const letters = useMemo(
    () => getLetters(activeChild?.language || "es"),
    [activeChild?.language]
  );

  const [activeLetter, setActiveLetter] = useState(letters[0]?.letter || "A");
  const [showCelebration, setShowCelebration] = useState(false);

  // Sync activeLetter when language/letters change (e.g., Russian Cyrillic set loads)
  useEffect(() => {
    if (letters.length > 0 && !letters.some((l) => l.letter === activeLetter)) {
      setActiveLetter(letters[0].letter);
    }
  }, [letters, activeLetter]);

  const completedLetters = useMemo(
    () =>
      new Set(
        records
          .filter((r) => r.status === "completed")
          .map((r) => r.item_identifier)
      ),
    [records]
  );

  const attemptedLetters = useMemo(
    () =>
      new Set(
        records
          .filter((r) => r.status === "attempted")
          .map((r) => r.item_identifier)
      ),
    [records]
  );

  useEffect(() => {
    if (activeChild) {
      fetchProgress("letter_tracing");
    }
  }, [activeChild, fetchProgress]);

  useEffect(() => {
    startTimer();
  }, [activeLetter, startTimer]);

  const activeStrokes = useMemo(
    () => letters.find((l) => l.letter === activeLetter)?.strokes || [],
    [letters, activeLetter]
  );

  const handleComplete = useCallback(async () => {
    success();
    setShowCelebration(true);
    const elapsed = getElapsedSeconds();
    await recordProgress(
      "letter_tracing",
      activeLetter,
      "completed",
      {},
      elapsed
    );
    // Auto-advance to next letter
    const idx = letters.findIndex((l) => l.letter === activeLetter);
    if (idx < letters.length - 1) {
      setTimeout(() => setActiveLetter(letters[idx + 1].letter), 1500);
    }
  }, [
    success,
    getElapsedSeconds,
    recordProgress,
    activeLetter,
    letters,
  ]);

  const handleLetterSelect = useCallback(
    async (letter: string) => {
      tap();
      if (!completedLetters.has(activeLetter) && !attemptedLetters.has(activeLetter)) {
        const elapsed = getElapsedSeconds();
        await recordProgress(
          "letter_tracing",
          activeLetter,
          "attempted",
          {},
          elapsed
        );
      }
      setActiveLetter(letter);
    },
    [tap, activeLetter, completedLetters, attemptedLetters, getElapsedSeconds, recordProgress]
  );

  if (!activeChild) {
    return <LoadingSpinner className="py-20" />;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
        {t("letter_tracing")}
      </h1>

      <div className="bg-white rounded-3xl shadow-lg shadow-pink-500/10 border-3 border-pink-200 overflow-hidden mb-4">
        <TracingCanvas
          strokes={activeStrokes}
          letter={activeLetter}
          canvasSize={Math.min(400, typeof window !== "undefined" ? window.innerWidth - 48 : 400)}
          onComplete={handleComplete}
        />
      </div>

      <LetterPicker
        letters={letters.map((l) => l.letter)}
        activeLetter={activeLetter}
        completedLetters={completedLetters}
        attemptedLetters={attemptedLetters}
        onSelect={handleLetterSelect}
      />

      <CelebrationOverlay
        show={showCelebration}
        message="⭐🎉⭐"
        onDone={() => setShowCelebration(false)}
      />
    </div>
  );
}
