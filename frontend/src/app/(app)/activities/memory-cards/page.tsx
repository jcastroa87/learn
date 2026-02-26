"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import { MEMORY_MODES } from "@/data/memory";
import MemoryCardGrid, { type MemoryDifficulty } from "@/components/activities/MemoryCardGrid";
import MemoryModeSelector from "@/components/activities/MemoryModeSelector";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function MemoryCardsPage() {
  const { t } = useTranslation("activities");
  const { activeChild } = useChildProfile();
  const { recordProgress } = useProgress(activeChild?.id ?? null);
  const { startTimer, getElapsedSeconds } = useActivityTimer();
  const { success, error: errorSound, speak } = useAudio({
    soundEnabled: true,
    language: activeChild?.language || "es",
  });

  const [mode, setMode] = useState("animals");
  const [difficulty, setDifficulty] = useState<MemoryDifficulty>("easy");
  const [round, setRound] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastTapCount, setLastTapCount] = useState(0);

  useState(() => {
    startTimer();
  });

  const activeMode = MEMORY_MODES.find((m) => m.id === mode) ?? MEMORY_MODES[0];
  const lang = activeChild?.language || "es";

  const items = activeMode.items.map((item) => ({
    content: item.content,
    ttsText: item.ttsText?.[lang] || item.content,
  }));

  const handleMatch = useCallback(
    (ttsText?: string) => {
      success();
      if (ttsText) {
        setTimeout(() => speak(ttsText), 300);
      }
    },
    [success, speak]
  );

  const handleMismatch = useCallback(() => {
    errorSound();
  }, [errorSound]);

  const handleComplete = useCallback(
    async (tapCount: number) => {
      setLastTapCount(tapCount);
      setShowResult(true);
      success();

      if (!activeChild) return;

      const elapsed = getElapsedSeconds();
      const pairsCount = difficulty === "easy" ? 3 : difficulty === "medium" ? 6 : 8;
      const minimumTaps = pairsCount * 2;
      const isMinimum = tapCount <= minimumTaps;

      await recordProgress("memory_cards", `${mode}_${difficulty}`, "completed", {
        tap_count: tapCount,
        minimum_taps: isMinimum,
        difficulty,
      }, elapsed);
    },
    [activeChild, mode, difficulty, success, getElapsedSeconds, recordProgress]
  );

  const handlePlayAgain = () => {
    setShowResult(false);
    setRound((r) => r + 1);
  };

  if (!activeChild) {
    return <LoadingSpinner className="py-20" />;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-3">{t("memory_cards")}</h1>

      {!showResult && (
        <>
          <MemoryModeSelector
            modes={MEMORY_MODES.map((m) => ({ id: m.id, label: m.label, icon: m.icon }))}
            activeMode={mode}
            onModeSelect={(m) => {
              setMode(m);
              setRound((r) => r + 1);
            }}
            difficulty={difficulty}
            onDifficultySelect={(d) => {
              setDifficulty(d);
              setRound((r) => r + 1);
            }}
          />

          <div className="mt-4 w-full max-w-md">
            <MemoryCardGrid
              key={`${mode}-${difficulty}-${round}`}
              items={items}
              difficulty={difficulty}
              onMatch={handleMatch}
              onMismatch={handleMismatch}
              onComplete={handleComplete}
            />
          </div>
        </>
      )}

      {showResult && (
        <div className="text-center mt-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-indigo-600 mb-2">
            {t("great_job")}
          </h2>
          <p className="text-zinc-600 mb-6">
            {t("taps_used", { count: lastTapCount })}
          </p>
          <button
            onClick={handlePlayAgain}
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors min-h-[44px]"
          >
            {t("play_again")}
          </button>
        </div>
      )}
    </div>
  );
}
