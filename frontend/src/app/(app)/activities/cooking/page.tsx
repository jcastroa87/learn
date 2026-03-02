"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { useProgress, useActivityTimer } from "@/hooks/useProgress";
import { useAudio } from "@/hooks/useAudio";
import { RECIPES } from "@/data/cooking/recipes";
import CookingGame from "@/components/activities/CookingGame";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CookingPage() {
  const { t } = useTranslation("activities");
  const { activeChild } = useChildProfile();
  const { recordProgress } = useProgress(activeChild?.id ?? null);
  const { startTimer, getElapsedSeconds } = useActivityTimer();
  const { success, error: errorSound } = useAudio({
    soundEnabled: true,
    language: activeChild?.language || "es",
  });

  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [lastErrors, setLastErrors] = useState(0);
  const [key, setKey] = useState(0);

  const lang = activeChild?.language || "es";
  const recipe = RECIPES.find((r) => r.id === selectedRecipe);

  useEffect(() => {
    if (selectedRecipe) startTimer();
  }, [selectedRecipe, startTimer]);

  const handleStepCorrect = useCallback(() => {
    success();
  }, [success]);

  const handleStepWrong = useCallback(() => {
    errorSound();
  }, [errorSound]);

  const handleComplete = useCallback(
    async (errors: number) => {
      setLastErrors(errors);
      setShowCelebration(true);
      setCompleted(true);
      success();

      if (!activeChild || !selectedRecipe) return;
      const elapsed = getElapsedSeconds();
      await recordProgress("cooking", selectedRecipe, "completed", { errors }, elapsed);
    },
    [activeChild, selectedRecipe, success, getElapsedSeconds, recordProgress]
  );

  const handlePlayAgain = () => {
    setCompleted(false);
    setSelectedRecipe(null);
  };

  const handleTryRecipeAgain = () => {
    setCompleted(false);
    setKey((k) => k + 1);
  };

  if (!activeChild) return <LoadingSpinner className="py-20" />;

  // Recipe selection screen
  if (!selectedRecipe) {
    return (
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          🍳 {t("cooking")}
        </h1>
        <p className="text-gray-500 font-semibold text-sm mb-6">
          {t("pick_a_recipe")}
        </p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {RECIPES.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRecipe(r.id)}
              className={`bg-gradient-to-br ${r.color} rounded-3xl p-6 text-center hover:scale-105 active:scale-95 transition-all shadow-lg btn-3d`}
            >
              <div className="text-5xl mb-2">{r.icon}</div>
              <p className="font-bold text-white text-sm drop-shadow-sm">
                {r.name[lang] || r.name.en}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Completed screen
  if (completed && recipe) {
    return (
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          🍳 {t("cooking")}
        </h1>

        <div className="text-center mt-8 animate-slide-up">
          <div className="text-8xl mb-4">{recipe.result}</div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2">
            {t("great_job")}
          </h2>
          <p className="text-gray-600 font-semibold mb-2">
            {recipe.name[lang] || recipe.name.en} {t("is_ready")}
          </p>
          {lastErrors === 0 && (
            <p className="text-green-500 font-bold text-lg mb-4">{t("perfect_chef")}</p>
          )}
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" onClick={handleTryRecipeAgain}>
              {t("again")}
            </Button>
            <Button variant="primary" onClick={handlePlayAgain}>
              {t("new_recipe")}
            </Button>
          </div>
        </div>

        <CelebrationOverlay
          show={showCelebration}
          message="⭐🎉⭐"
          onDone={() => setShowCelebration(false)}
        />
      </div>
    );
  }

  // Cooking in progress
  if (!recipe) return <LoadingSpinner className="py-20" />;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-extrabold mb-1 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
        🍳 {recipe.name[lang] || recipe.name.en}
      </h1>

      <div className="mt-4 w-full flex justify-center">
        <CookingGame
          key={`${recipe.id}-${key}`}
          recipe={recipe}
          language={lang}
          onStepCorrect={handleStepCorrect}
          onStepWrong={handleStepWrong}
          onComplete={handleComplete}
        />
      </div>

      <CelebrationOverlay
        show={showCelebration}
        message="⭐🎉⭐"
        onDone={() => setShowCelebration(false)}
      />
    </div>
  );
}
