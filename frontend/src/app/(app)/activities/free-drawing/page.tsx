"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import type { DrawingTool } from "@/components/canvas/DrawingCanvas";

const DrawingCanvas = dynamic(() => import("@/components/canvas/DrawingCanvas"), { ssr: false });
import ColorPalette from "@/components/activities/ColorPalette";
import BackgroundSelector from "@/components/activities/BackgroundSelector";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const BRUSH_SIZES = [4, 8, 14];

export default function FreeDrawingPage() {
  const { t } = useTranslation("activities");
  const router = useRouter();
  const { activeChild } = useChildProfile();
  const { recordProgress } = useProgress(activeChild?.id ?? null);
  const { startTimer, getElapsedSeconds } = useActivityTimer();
  const { success } = useAudio({
    soundEnabled: true,
    language: activeChild?.language || "es",
  });
  const { pushAction, undo, canUndo } = useUndoRedo();
  const [undoTrigger, setUndoTrigger] = useState(0);
  const stageRef = useRef(null);

  const [activeColor, setActiveColor] = useState("#000000");
  const [tool, setTool] = useState<DrawingTool>("brush");
  const [rainbow, setRainbow] = useState(false);
  const [brushSize, setBrushSize] = useState(8);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [saving, setSaving] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  useState(() => {
    startTimer();
  });

  const handleSave = useCallback(async () => {
    if (!activeChild || !stageRef.current || saving) return;
    setSaving(true);

    try {
      const stage = stageRef.current as { toBlob: (opts: { callback: (blob: Blob) => void }) => void };
      stage.toBlob({
        callback: async (blob: Blob) => {
          const formData = new FormData();
          formData.append("file", blob, "drawing.png");
          formData.append("activity_type", "free_drawing");

          const res = await fetch(`/api/children/${activeChild.id}/artworks`, {
            method: "POST",
            body: formData,
            credentials: "include",
            headers: {
              "X-XSRF-TOKEN": decodeURIComponent(
                document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ""
              ),
            },
          });

          if (res.ok) {
            success();
            const elapsed = getElapsedSeconds();
            await recordProgress("free_drawing", "free_drawing", "completed", {}, elapsed);
          }
          setSaving(false);
        },
      });
    } catch {
      setSaving(false);
    }
  }, [activeChild, saving, success, getElapsedSeconds, recordProgress]);

  if (!activeChild) {
    return <LoadingSpinner className="py-20" />;
  }

  const canvasSize = Math.min(600, typeof window !== "undefined" ? Math.min(window.innerWidth - 32, window.innerHeight - 260) : 600);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-extrabold mb-3 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">{t("free_drawing")}</h2>

      <div className="bg-white rounded-3xl shadow-lg shadow-orange-500/10 border-3 border-orange-200 overflow-hidden mb-3">
        <DrawingCanvas
          canvasSize={canvasSize}
          activeColor={activeColor}
          tool={tool}
          brushSize={brushSize}
          rainbow={rainbow}
          backgroundColor={backgroundColor}
          onAction={pushAction}
          stageRef={stageRef}
          undoTrigger={undoTrigger}
        />
      </div>

      <div className="flex gap-2 mb-3 flex-wrap justify-center">
        <Button
          size="sm"
          variant={tool === "brush" ? "primary" : "secondary"}
          onClick={() => setTool("brush")}
        >
          {t("brush")}
        </Button>
        <Button
          size="sm"
          variant={tool === "eraser" ? "primary" : "secondary"}
          onClick={() => setTool("eraser")}
        >
          {t("eraser")}
        </Button>
        {BRUSH_SIZES.map((size) => (
          <Button
            key={size}
            size="sm"
            variant={brushSize === size ? "primary" : "ghost"}
            onClick={() => setBrushSize(size)}
          >
            <span
              className="inline-block rounded-full bg-current"
              style={{ width: size + 4, height: size + 4 }}
            />
          </Button>
        ))}
        <Button size="sm" variant="ghost" disabled={!canUndo} onClick={() => { undo(); setUndoTrigger((n) => n + 1); }}>
          {t("undo")}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowBgPicker(!showBgPicker)}
        >
          {t("background")}
        </Button>
        <Button size="sm" variant="primary" loading={saving} onClick={handleSave}>
          {t("save_artwork")}
        </Button>
      </div>

      {showBgPicker && (
        <div className="mb-3">
          <BackgroundSelector
            activeBackground={backgroundColor}
            onSelect={(c) => {
              setBackgroundColor(c);
              setShowBgPicker(false);
            }}
          />
        </div>
      )}

      <ColorPalette
        activeColor={activeColor}
        rainbow={rainbow}
        onColorSelect={(c) => {
          setActiveColor(c);
          setRainbow(false);
          setTool("brush");
        }}
        onRainbowToggle={() => setRainbow(!rainbow)}
      />
    </div>
  );
}
