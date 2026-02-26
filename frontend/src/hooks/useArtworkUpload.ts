"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface PendingUpload {
  blob: Blob;
  activityType: string;
  childId: number;
  timestamp: number;
}

const STORAGE_KEY = "gorila_pending_artworks";

function getPendingUploads(): PendingUpload[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePendingUploads(uploads: PendingUpload[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads));
}

export function useArtworkUpload(childId: number | null) {
  const [uploading, setUploading] = useState(false);
  const retryRef = useRef(false);

  const upload = useCallback(
    async (blob: Blob, activityType: string): Promise<boolean> => {
      if (!childId) return false;
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", blob, "artwork.png");
        formData.append("activity_type", activityType);

        const res = await fetch(`/api/children/${childId}/artworks`, {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(
              document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ""
            ),
          },
        });

        setUploading(false);

        if (res.ok) return true;

        // Store for retry
        const reader = new FileReader();
        reader.onload = () => {
          const pending = getPendingUploads();
          pending.push({
            blob: new Blob([reader.result as ArrayBuffer], { type: blob.type }),
            activityType,
            childId,
            timestamp: Date.now(),
          });
          savePendingUploads(pending);
        };
        reader.readAsArrayBuffer(blob);

        return false;
      } catch {
        setUploading(false);
        return false;
      }
    },
    [childId]
  );

  // Auto-retry pending uploads on mount
  useEffect(() => {
    if (!childId || retryRef.current) return;
    retryRef.current = true;

    const pending = getPendingUploads();
    if (pending.length === 0) return;

    const retryAll = async () => {
      const remaining: PendingUpload[] = [];

      for (const item of pending) {
        if (item.childId !== childId) {
          remaining.push(item);
          continue;
        }

        try {
          const formData = new FormData();
          formData.append("file", new Blob([item.blob]), "artwork.png");
          formData.append("activity_type", item.activityType);

          const res = await fetch(`/api/children/${childId}/artworks`, {
            method: "POST",
            body: formData,
            credentials: "include",
            headers: {
              "X-XSRF-TOKEN": decodeURIComponent(
                document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ""
              ),
            },
          });

          if (!res.ok) remaining.push(item);
        } catch {
          remaining.push(item);
        }
      }

      savePendingUploads(remaining);
    };

    retryAll();
  }, [childId]);

  return { upload, uploading };
}
