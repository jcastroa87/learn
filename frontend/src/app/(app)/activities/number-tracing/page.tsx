"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import numberWaypoints from "@/data/waypoints/numbers";
import QuantityVisualization from "@/components/activities/QuantityVisualization";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const TracingCanvas = dynamic(() => import("@/components/canvas/TracingCanvas"), { ssr: false });

export default function NumberTracingPage() {
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

  const [activeNumber, setActiveNumber] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const completedNumbers = useMemo(
    () =>
      new Set(
        records
          .filter((r) => r.status === "completed")
          .map((r) => Number(r.item_identifier))
      ),
    [records]
  );

  useEffect(() => {
    if (activeChild) fetchProgress("number_tracing");
  }, [activeChild, fetchProgress]);

  useEffect(() => {
    startTimer();
  }, [activeNumber, startTimer]);

  const activeWaypoint = useMemo(
    () => numberWaypoints.find((n) => n.number === activeNumber),
    [activeNumber]
  );

  const handleComplete = useCallback(async () => {
    success();
    setShowCelebration(true);
    const elapsed = getElapsedSeconds();
    await recordProgress(
      "number_tracing",
      String(activeNumber),
      "completed",
      {},
      elapsed
    );
    if (activeNumber < 20) {
      setTimeout(() => setActiveNumber((n) => n + 1), 1500);
    }
  }, [success, getElapsedSeconds, recordProgress, activeNumber]);

  const handleNumberSelect = useCallback(
    (num: number) => {
      tap();
      setActiveNumber(num);
    },
    [tap]
  );

  if (!activeChild) return <LoadingSpinner className="py-20" />;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
        {t("number_tracing")}
      </h1>

      <QuantityVisualization count={activeNumber} />

      <div className="bg-white rounded-3xl shadow-lg shadow-blue-500/10 border-3 border-sky-200 overflow-hidden mb-4">
        {activeWaypoint && (
          <TracingCanvas
            strokes={activeWaypoint.strokes}
            letter={String(activeNumber)}
            canvasSize={Math.min(380, typeof window !== "undefined" ? window.innerWidth - 48 : 380)}
            onComplete={handleComplete}
          />
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
        {Array.from({ length: 21 }, (_, i) => (
          <button
            key={i}
            onClick={() => handleNumberSelect(i)}
            className={`w-11 h-11 rounded-xl font-bold text-sm flex items-center justify-center transition-all shrink-0 min-h-[44px] min-w-[44px] ${
              completedNumbers.has(i)
                ? "bg-gradient-to-b from-green-400 to-green-500 text-white shadow-md shadow-green-500/30"
                : activeNumber === i
                ? "bg-white ring-3 ring-indigo-400 ring-offset-2 scale-110 shadow-md border-2 border-gray-200"
                : "bg-white text-gray-500 border-2 border-gray-200 shadow-sm"
            }`}
          >
            {i}
          </button>
        ))}
      </div>

      <CelebrationOverlay
        show={showCelebration}
        message="⭐ Super! ⭐"
        onDone={() => setShowCelebration(false)}
      />
    </div>
  );
}
