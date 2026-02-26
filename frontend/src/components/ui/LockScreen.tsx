"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

interface LockScreenProps {
  onDismiss: () => void;
}

export default function LockScreen({ onDismiss }: LockScreenProps) {
  const { t } = useTranslation("ui");
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handlePointerDown = useCallback(() => {
    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / 30; // 3 seconds = 30 intervals of 100ms
        if (next >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          onDismiss();
          return 100;
        }
        return next;
      });
    }, 100);
  }, [onDismiss]);

  const handlePointerUp = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgress(0);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-indigo-900 flex flex-col items-center justify-center text-white">
      <div className="text-6xl mb-6">⏰</div>
      <h1 className="text-3xl font-bold mb-2">{t("times_up")}</h1>
      <p className="text-indigo-200 mb-8">{t("hold_to_dismiss")}</p>

      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-20 h-20 rounded-full bg-white/20 flex items-center justify-center select-none"
      >
        <svg className="absolute w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 36}`}
            strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
            className="transition-all duration-100"
          />
        </svg>
        <span className="text-2xl">🔓</span>
      </button>
    </div>
  );
}
