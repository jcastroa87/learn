"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseSessionTimerOptions {
  timeLimitMinutes: number;
  enabled: boolean;
}

export function useSessionTimer({ timeLimitMinutes, enabled }: UseSessionTimerOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    timeLimitMinutes * 60
  );
  const [isWarning, setIsWarning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || isPaused || isLocked) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = prev - 1;
        if (next <= 60 && next > 0) {
          setIsWarning(true);
        }
        if (next <= 0) {
          setIsLocked(true);
          setIsWarning(false);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, isPaused, isLocked]);

  // Pause on visibility change
  useEffect(() => {
    function handleVisibility() {
      setIsPaused(document.hidden);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const dismiss = useCallback(() => {
    setIsLocked(false);
    setIsWarning(false);
    setRemainingSeconds(timeLimitMinutes * 60);
  }, [timeLimitMinutes]);

  const formatTime = useCallback(() => {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [remainingSeconds]);

  return {
    remainingSeconds,
    isWarning,
    isLocked,
    dismiss,
    formatTime,
  };
}
