"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import { getPuzzleById, type PuzzleDifficulty } from "@/data/puzzles";
import PuzzleCanvas from "@/components/canvas/PuzzleCanvas";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function PuzzleActivityPage() {
  const { t } = useTranslation("activities");
  const params = useParams();
  const { activeChild } = useChildProfile();
  const { recordProgress } = useProgress(activeChild?.id ?? null);
  const { startTimer, getElapsedSeconds } = useActivityTimer();
  const { success } = useAudio({
    soundEnabled: true,
    language: activeChild?.language || "es",
  });

  const puzzleId = params.puzzleId as string;
  const puzzle = getPuzzleById(puzzleId);

  const [difficulty, setDifficulty] = useState<PuzzleDifficulty>("easy");
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [round, setRound] = useState(0);

  useState(() => {
    startTimer();
  });

  const handleComplete = useCallback(async () => {
    setCompleted(true);
    success();

    if (!activeChild) return;
    const elapsed = getElapsedSeconds();
    await recordProgress("puzzles", puzzleId, "completed", { difficulty }, elapsed);
  }, [activeChild, puzzleId, difficulty, success, getElapsedSeconds, recordProgress]);

  const handlePlayAgain = () => {
    setCompleted(false);
    setRound((r) => r + 1);
  };

  if (!activeChild || !puzzle) {
    return <LoadingSpinner className="py-20" />;
  }

  const canvasSize = Math.min(360, typeof window !== "undefined" ? window.innerWidth - 32 : 360);
  const lang = activeChild.language || "es";

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-lg font-semibold mb-2">
        {puzzle.name[lang] || puzzle.name.en}
      </h2>

      {!completed && (
        <>
          <div className="flex gap-2 mb-3">
            {(["easy", "medium", "hard"] as PuzzleDifficulty[]).map((d) => (
              <Button
                key={d}
                size="sm"
                variant={difficulty === d ? "primary" : "secondary"}
                onClick={() => {
                  setDifficulty(d);
                  setRound((r) => r + 1);
                }}
              >
                {t(d)}
              </Button>
            ))}
          </div>

          <div className="mb-3">
            <Button
              size="sm"
              variant="ghost"
              onPointerDown={() => setShowHint(true)}
              onPointerUp={() => setShowHint(false)}
              onPointerLeave={() => setShowHint(false)}
            >
              {t("hint")}
            </Button>
          </div>

          <PuzzleCanvas
            key={`${puzzleId}-${difficulty}-${round}`}
            image={puzzle.image}
            difficulty={difficulty}
            gridColor={puzzle.gridColor}
            canvasSize={canvasSize}
            onComplete={handleComplete}
            showHint={showHint}
          />
        </>
      )}

      {completed && (
        <div className="text-center mt-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">
            {t("great_job")}
          </h2>
          <Button variant="primary" onClick={handlePlayAgain}>
            {t("play_again")}
          </Button>
        </div>
      )}
    </div>
  );
}
