"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import {
  SORTING_CATEGORIES,
  getRoundsByCategory,
  type SortingCategory,
  type SortingItem,
} from "@/data/sorting";
import ModeSelector from "@/components/activities/ModeSelector";
import CategoryBin from "@/components/activities/CategoryBin";
import Button from "@/components/ui/Button";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const SNAP_THRESHOLD = 50;

export default function SortingPage() {
  const { t } = useTranslation("activities");
  const { activeChild } = useChildProfile();
  const { recordProgress } = useProgress(activeChild?.id ?? null);
  const { startTimer, getElapsedSeconds } = useActivityTimer();
  const { success, error: errorSound, tts } = useAudio({
    soundEnabled: true,
    language: activeChild?.language || "es",
  });

  const [category, setCategory] = useState<SortingCategory>("animals");
  const [roundIndex, setRoundIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState(0);
  const [sorted, setSorted] = useState<Record<string, SortingItem[]>>({});
  const [remaining, setRemaining] = useState<SortingItem[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [overBin, setOverBin] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const binRefs = useRef<Record<string, DOMRect>>({});
  const [key, setKey] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const rounds = getRoundsByCategory(category);
  const round = rounds[roundIndex % rounds.length];
  const lang = activeChild?.language || "es";

  useState(() => {
    startTimer();
  });

  // Initialize remaining items when round changes
  useState(() => {
    if (round) {
      const shuffled = [...round.items].sort(() => Math.random() - 0.5);
      setRemaining(shuffled);
      setSorted({});
      setErrors(0);
      setCompleted(false);
    }
  });

  // Re-initialize when key changes
  const initRound = useCallback(() => {
    if (!round) return;
    const shuffled = [...round.items].sort(() => Math.random() - 0.5);
    setRemaining(shuffled);
    setSorted({});
    setErrors(0);
    setCompleted(false);
  }, [round]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, item: SortingItem) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      dragOffset.current = { x: 20, y: 20 };
      setDragPos({ x: e.clientX - rect.left - 20, y: e.clientY - rect.top - 20 });
      setDragging(item.id);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left - dragOffset.current.x;
      const y = e.clientY - rect.top - dragOffset.current.y;
      setDragPos({ x, y });

      // Check if over a bin
      let foundBin: string | null = null;
      for (const [binId, binRect] of Object.entries(binRefs.current)) {
        if (
          e.clientX >= binRect.left &&
          e.clientX <= binRect.right &&
          e.clientY >= binRect.top &&
          e.clientY <= binRect.bottom
        ) {
          foundBin = binId;
          break;
        }
      }
      setOverBin(foundBin);
    },
    [dragging]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragging || !round) {
      setDragging(null);
      return;
    }

    const item = remaining.find((i) => i.id === dragging);
    if (!item) {
      setDragging(null);
      return;
    }

    if (overBin) {
      if (item.correctBin === overBin) {
        // Correct!
        success();
        const text = item.ttsText[lang];
        if (text) setTimeout(() => tts(text), 200);

        const newRemaining = remaining.filter((i) => i.id !== item.id);
        setRemaining(newRemaining);
        setSorted((prev) => ({
          ...prev,
          [overBin]: [...(prev[overBin] || []), item],
        }));

        if (newRemaining.length === 0) {
          setCompleted(true);
          setShowCelebration(true);
          if (activeChild) {
            const elapsed = getElapsedSeconds();
            recordProgress("sorting", round.id, "completed", {
              errors,
              category,
            }, elapsed);
          }
        }
      } else {
        // Wrong bin
        errorSound();
        setErrors((e) => e + 1);
      }
    }

    setDragging(null);
    setOverBin(null);
  }, [dragging, remaining, overBin, round, lang, errors, category, activeChild, success, errorSound, tts, getElapsedSeconds, recordProgress]);

  const handleNextRound = () => {
    setRoundIndex((i) => i + 1);
    setKey((k) => k + 1);
    initRound();
  };

  if (!activeChild) return <LoadingSpinner className="py-20" />;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-extrabold mb-3 bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
        {t("sorting")}
      </h1>

      <ModeSelector
        modes={SORTING_CATEGORIES as unknown as string[]}
        activeMode={category}
        onSelect={(m) => {
          setCategory(m as SortingCategory);
          setRoundIndex(0);
          setKey((k) => k + 1);
          initRound();
        }}
      />

      <p className="text-sm text-gray-500 font-semibold mt-2 mb-3">
        {round?.name[lang] || round?.name.en}
      </p>

      {!completed && round && (
        <div
          ref={containerRef}
          className="relative w-full max-w-md touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Bins */}
          <div className="flex gap-3 mb-4">
            {round.bins.map((bin) => (
              <div
                key={bin.id}
                ref={(el) => {
                  if (el) binRefs.current[bin.id] = el.getBoundingClientRect();
                }}
              >
                <CategoryBin
                  label={bin.label[lang] || bin.label.en}
                  icon={bin.icon}
                  items={sorted[bin.id] || []}
                  isOver={overBin === bin.id}
                />
              </div>
            ))}
          </div>

          {/* Remaining items */}
          <div className="flex flex-wrap gap-3 justify-center">
            {remaining.map((item) => (
              <div
                key={item.id}
                onPointerDown={(e) => handlePointerDown(e, item)}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl border-2 text-2xl select-none transition-all ${
                  dragging === item.id
                    ? "opacity-30"
                    : "border-gray-200 bg-white shadow-md cursor-grab hover:scale-110"
                }`}
                style={{ touchAction: "none" }}
              >
                {item.content}
              </div>
            ))}
          </div>

          {/* Dragging ghost */}
          {dragging && (
            <div
              className="absolute w-14 h-14 flex items-center justify-center rounded-2xl border-3 border-indigo-400 bg-white shadow-xl text-2xl z-50 pointer-events-none scale-110"
              style={{ left: dragPos.x, top: dragPos.y }}
            >
              {remaining.find((i) => i.id === dragging)?.content}
            </div>
          )}
        </div>
      )}

      {completed && (
        <div className="text-center mt-8 animate-slide-up">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2">
            {t("great_job")}
          </h2>
          {errors === 0 && (
            <p className="text-green-500 font-bold text-lg mb-2">{t("perfect")}</p>
          )}
          <Button variant="primary" onClick={handleNextRound}>
            {t("next_round")}
          </Button>
        </div>
      )}

      <CelebrationOverlay
        show={showCelebration}
        message="🎉 Awesome! 🎉"
        onDone={() => setShowCelebration(false)}
      />
    </div>
  );
}
