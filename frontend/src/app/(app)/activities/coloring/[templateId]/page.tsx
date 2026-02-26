"use client";

import { useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { getTemplateById } from "@/data/coloring";
import ColoringCanvas, { type ToolMode } from "@/components/canvas/ColoringCanvas";
import ColorPalette from "@/components/activities/ColorPalette";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ColoringWorkspacePage() {
  const { t } = useTranslation("activities");
  const params = useParams();
  const router = useRouter();
  const { activeChild } = useChildProfile();
  const { recordProgress } = useProgress(activeChild?.id ?? null);
  const { startTimer, getElapsedSeconds } = useActivityTimer();
  const { success } = useAudio({
    soundEnabled: true,
    language: activeChild?.language || "es",
  });
  const { pushAction, canUndo } = useUndoRedo();
  const stageRef = useRef(null);

  const [activeColor, setActiveColor] = useState("#FF0000");
  const [toolMode, setToolMode] = useState<ToolMode>("fill");
  const [rainbow, setRainbow] = useState(false);
  const [brushSize] = useState(6);
  const [saving, setSaving] = useState(false);

  const templateId = params.templateId as string;
  const template = getTemplateById(templateId);

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
          formData.append("file", blob, "artwork.png");
          formData.append("activity_type", "coloring");

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
            await recordProgress("coloring", templateId, "completed", {}, elapsed);
          }
          setSaving(false);
        },
      });
    } catch {
      setSaving(false);
    }
  }, [activeChild, saving, success, getElapsedSeconds, recordProgress, templateId]);

  if (!activeChild || !template) {
    return <LoadingSpinner className="py-20" />;
  }

  const canvasSize = Math.min(400, typeof window !== "undefined" ? window.innerWidth - 32 : 400);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-lg font-semibold mb-3">
        {template.name[activeChild.language] || template.name.en}
      </h2>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden mb-3">
        <ColoringCanvas
          regions={template.regions}
          canvasSize={canvasSize}
          activeColor={activeColor}
          toolMode={toolMode}
          brushSize={brushSize}
          rainbow={rainbow}
          onAction={pushAction}
          stageRef={stageRef}
        />
      </div>

      <div className="flex gap-2 mb-3">
        <Button
          size="sm"
          variant={toolMode === "fill" ? "primary" : "secondary"}
          onClick={() => setToolMode("fill")}
        >
          {t("fill")}
        </Button>
        <Button
          size="sm"
          variant={toolMode === "brush" ? "primary" : "secondary"}
          onClick={() => setToolMode("brush")}
        >
          {t("brush")}
        </Button>
        <Button size="sm" variant="ghost" disabled={!canUndo}>
          {t("undo")}
        </Button>
        <Button
          size="sm"
          variant="primary"
          loading={saving}
          onClick={handleSave}
        >
          {t("save_artwork")}
        </Button>
      </div>

      <ColorPalette
        activeColor={activeColor}
        rainbow={rainbow}
        onColorSelect={(c) => {
          setActiveColor(c);
          setRainbow(false);
        }}
        onRainbowToggle={() => setRainbow(!rainbow)}
      />
    </div>
  );
}
