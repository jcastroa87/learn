"use client";

import { useState, useCallback, useRef } from "react";
import { apiGet, apiPost } from "@/lib/api";
import type {
  ProgressRecord,
  ProgressSummary,
  ProgressResult,
  ProgressStatus,
  ModuleType,
} from "@/types";

export function useActivityTimer() {
  const startTimeRef = useRef<number>(0);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);

  const getElapsedSeconds = useCallback(() => {
    if (startTimeRef.current === 0) return 0;
    return Math.round((Date.now() - startTimeRef.current) / 1000);
  }, []);

  return { startTimer, getElapsedSeconds };
}

export function useProgress(childId: number | null) {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProgress = useCallback(
    async (module: ModuleType) => {
      if (!childId) return;
      setLoading(true);
      const res = await apiGet<ProgressRecord[]>(
        `/api/children/${childId}/progress?module=${module}`
      );
      if (res.success) {
        setRecords(res.data);
      }
      setLoading(false);
    },
    [childId]
  );

  const fetchSummary = useCallback(async () => {
    if (!childId) return;
    setLoading(true);
    const res = await apiGet<ProgressSummary>(
      `/api/children/${childId}/progress/summary`
    );
    if (res.success) {
      setSummary(res.data);
    }
    setLoading(false);
  }, [childId]);

  const recordProgress = useCallback(
    async (
      moduleType: ModuleType,
      itemIdentifier: string,
      status: ProgressStatus,
      metadata?: Record<string, unknown>,
      durationSeconds?: number
    ) => {
      if (!childId) return null;
      const res = await apiPost<ProgressResult>(
        `/api/children/${childId}/progress`,
        {
          module_type: moduleType,
          item_identifier: itemIdentifier,
          status,
          metadata,
          duration_seconds: durationSeconds,
        }
      );
      return res.success ? res.data : null;
    },
    [childId]
  );

  return {
    records,
    summary,
    loading,
    fetchProgress,
    fetchSummary,
    recordProgress,
  };
}
