"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import { getMatchPairs, MATCHING_MODES, type MatchingMode } from "@/data/matching";
import MatchingBoard from "@/components/activities/MatchingBoard";
import ModeSelector from "@/components/activities/ModeSelector";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";

export default function MatchingPage() {
  const { t } = useTranslation("activities");
  const { activeChild } = useChildProfile();
  const { recordProgress } = useProgress(activeChild?.id ?? null);
  const { startTimer, getElapsedSeconds } = useActivityTimer();
  const { success, error: errorSound, tts } = useAudio({
    soundEnabled: true,
    language: activeChild?.language || "es",
  });

  const [mode, setMode] = useState<MatchingMode>("colors");
  const [round, setRound] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastResult, setLastResult] = useState<{
    errors: number;
    bananas: number;
  } | null>(null);

  const pairs = useMemo(() => {
    // Re-generate pairs when mode or round changes
    void round;
    return getMatchPairs(mode);
  }, [mode, round]);

  const handleModeChange = useCallback(
    (newMode: MatchingMode) => {
      setMode(newMode);
      setRound((r) => r + 1);
      setShowResult(false);
      startTimer();
    },
    [startTimer]
  );

  const handleMatch = useCallback(
    (pair: { ttsText?: Record<string, string> }) => {
      success();
      const lang = activeChild?.language || "es";
      if (pair.ttsText?.[lang]) {
        setTimeout(() => tts(pair.ttsText![lang]), 200);
      }
    },
    [success, tts, activeChild]
  );

  const handleError = useCallback(() => {
    errorSound();
  }, [errorSound]);

  const handleComplete = useCallback(
    async (errorCount: number) => {
      const elapsed = getElapsedSeconds();
      const result = await recordProgress(
        "matching",
        `${mode}_round_${round}`,
        "completed",
        { errors: errorCount, mode },
        elapsed
      );
      setLastResult({
        errors: errorCount,
        bananas: result?.bananas_awarded || 0,
      });
      setShowCelebration(true);
      success();
      setTimeout(() => setShowResult(true), 1500);
    },
    [getElapsedSeconds, recordProgress, mode, round, success]
  );

  const handleNextRound = useCallback(() => {
    setRound((r) => r + 1);
    setShowResult(false);
    startTimer();
  }, [startTimer]);

  if (!activeChild) return <LoadingSpinner className="py-20" />;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-extrabold mb-3 bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">{t("matching")}</h1>

      <ModeSelector
        modes={MATCHING_MODES}
        activeMode={mode}
        onSelect={handleModeChange}
      />

      <div className="mt-6">
        {showResult ? (
          <div className="text-center py-8 animate-slide-up">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2">{t("great_job")}</h2>
            {lastResult && (
              <>
                <p className="text-amber-600 text-xl font-bold mb-4">
                  🍌 {t("bananas_earned", { count: lastResult.bananas })}
                </p>
                {lastResult.errors === 0 && (
                  <p className="text-green-500 font-bold text-lg mb-4">
                    Perfect! +3 bonus 🍌
                  </p>
                )}
              </>
            )}
            <Button onClick={handleNextRound}>{t("try_again")}</Button>
          </div>
        ) : (
          <MatchingBoard
            pairs={pairs}
            language={activeChild.language}
            onMatch={handleMatch}
            onError={handleError}
            onComplete={handleComplete}
          />
        )}
      </div>

      <CelebrationOverlay
        show={showCelebration}
        message="🎉 Bravo! 🎉"
        onDone={() => setShowCelebration(false)}
      />
    </div>
  );
}
