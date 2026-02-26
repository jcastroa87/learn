"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import numberWaypoints from "@/data/waypoints/numbers";
import TracingCanvas from "@/components/canvas/TracingCanvas";
import QuantityVisualization from "@/components/activities/QuantityVisualization";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
    const elapsed = getElapsedSeconds();
    await recordProgress(
      "number_tracing",
      String(activeNumber),
      "completed",
      {},
      elapsed
    );
    if (activeNumber < 20) {
      setTimeout(() => setActiveNumber((n) => n + 1), 800);
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
      <h1 className="text-xl font-bold mb-2">{t("number_tracing")}</h1>

      <QuantityVisualization count={activeNumber} />

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden mb-4">
        {activeWaypoint && (
          <TracingCanvas
            waypoints={activeWaypoint.waypoints}
            letter={String(activeNumber)}
            canvasSize={Math.min(380, typeof window !== "undefined" ? window.innerWidth - 48 : 380)}
            onComplete={handleComplete}
          />
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto py-2 px-1">
        {Array.from({ length: 21 }, (_, i) => (
          <button
            key={i}
            onClick={() => handleNumberSelect(i)}
            className={`w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all shrink-0 min-h-[44px] min-w-[44px] ${
              completedNumbers.has(i)
                ? "bg-emerald-500 text-white"
                : activeNumber === i
                ? "bg-zinc-200 ring-2 ring-emerald-400 scale-110"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}
