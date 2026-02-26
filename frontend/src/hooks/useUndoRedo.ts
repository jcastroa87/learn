"use client";

import { useState, useCallback, useRef } from "react";

export type UndoAction =
  | { type: "fill"; regionId: string; prevColor: string; newColor: string }
  | { type: "stroke"; points: number[]; color: string; width: number }
  | { type: "sticker"; stickerId: string; x: number; y: number }
  | { type: "erase"; points: number[]; width: number };

const MAX_HISTORY = 30;

export function useUndoRedo() {
  const [history, setHistory] = useState<UndoAction[]>([]);
  const currentIndexRef = useRef(-1);

  const pushAction = useCallback((action: UndoAction) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndexRef.current + 1);
      newHistory.push(action);
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      } else {
        currentIndexRef.current++;
      }
      return newHistory;
    });
    currentIndexRef.current = Math.min(currentIndexRef.current + 1, MAX_HISTORY - 1);
  }, []);

  const undo = useCallback((): UndoAction | null => {
    if (currentIndexRef.current < 0) return null;
    const action = history[currentIndexRef.current];
    currentIndexRef.current--;
    return action;
  }, [history]);

  const canUndo = currentIndexRef.current >= 0;

  const reset = useCallback(() => {
    setHistory([]);
    currentIndexRef.current = -1;
  }, []);

  return { pushAction, undo, canUndo, reset };
}
