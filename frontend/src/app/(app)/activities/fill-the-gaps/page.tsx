"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import { SCENE_THEMES, getScenesByTheme, type SceneTheme, type SceneObject } from "@/data/fill-the-gaps";
import ModeSelector from "@/components/activities/ModeSelector";
import SceneRenderer from "@/components/activities/SceneRenderer";
import Button from "@/components/ui/Button";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function FillTheGapsPage() {
  const { t } = useTranslation("activities");
  const { activeChild } = useChildProfile();
  const { recordProgress } = useProgress(activeChild?.id ?? null);
  const { startTimer, getElapsedSeconds } = useActivityTimer();
  const { success, error: errorSound, tts } = useAudio({
    soundEnabled: true,
    language: activeChild?.language || "es",
  });

  const [theme, setTheme] = useState<SceneTheme>("farm");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState(0);
  const [round, setRound] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useState(() => {
    startTimer();
  });

  const scenes = getScenesByTheme(theme);
  const scene = scenes[sceneIndex % scenes.length];
  const lang = activeChild?.language || "es";

  const handleCorrectPlace = useCallback(
    (obj: SceneObject) => {
      success();
      const text = obj.ttsText[lang];
      if (text) setTimeout(() => tts(text), 200);
    },
    [success, tts, lang]
  );

  const handleWrongPlace = useCallback(() => {
    errorSound();
    setErrors((e) => e + 1);
  }, [errorSound]);

  const handleComplete = useCallback(async () => {
    setCompleted(true);
    setShowCelebration(true);
    success();

    if (!activeChild || !scene) return;
    const elapsed = getElapsedSeconds();
    await recordProgress("fill_the_gaps", scene.id, "completed", {
      errors,
      theme,
    }, elapsed);
  }, [activeChild, scene, errors, theme, success, getElapsedSeconds, recordProgress]);

  const handleNext = () => {
    setCompleted(false);
    setErrors(0);
    setSceneIndex((i) => i + 1);
    setRound((r) => r + 1);
  };

  if (!activeChild) return <LoadingSpinner className="py-20" />;

  const canvasSize = Math.min(360, typeof window !== "undefined" ? window.innerWidth - 32 : 360);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-extrabold mb-3 bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">{t("fill_the_gaps")}</h1>

      {!completed && (
        <>
          <ModeSelector
            modes={SCENE_THEMES as unknown as string[]}
            activeMode={theme}
            onSelect={(m) => {
              setTheme(m as SceneTheme);
              setSceneIndex(0);
              setRound((r) => r + 1);
            }}
          />

          <p className="text-sm text-gray-500 font-semibold mt-2 mb-3">
            {scene?.name[lang] || scene?.name.en}
          </p>

          {scene && (
            <SceneRenderer
              key={`${scene.id}-${round}`}
              backgroundColor={scene.backgroundColor}
              backgroundEmoji={scene.background}
              objects={scene.objects}
              canvasSize={canvasSize}
              onCorrectPlace={handleCorrectPlace}
              onWrongPlace={handleWrongPlace}
              onComplete={handleComplete}
            />
          )}
        </>
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
          <Button variant="primary" onClick={handleNext}>
            {t("next_scene")}
          </Button>
        </div>
      )}

      <CelebrationOverlay
        show={showCelebration}
        message="⭐ Wonderful! ⭐"
        onDone={() => setShowCelebration(false)}
      />
    </div>
  );
}
