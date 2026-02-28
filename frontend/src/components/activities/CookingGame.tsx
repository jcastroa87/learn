"use client";

import { useState, useCallback } from "react";
import type { Recipe } from "@/data/cooking/recipes";

interface CookingGameProps {
  recipe: Recipe;
  language: string;
  onStepCorrect: () => void;
  onStepWrong: () => void;
  onComplete: (errors: number) => void;
}

export default function CookingGame({
  recipe,
  language,
  onStepCorrect,
  onStepWrong,
  onComplete,
}: CookingGameProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [wrongItem, setWrongItem] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [stepCompleted, setStepCompleted] = useState(false);

  const step = recipe.steps[stepIndex];
  const isLastStep = stepIndex >= recipe.steps.length - 1;

  const handleItemTap = useCallback(
    (item: string) => {
      if (stepCompleted) return;

      if (item === step.items[0]) {
        // Correct item (first item in each step is the correct one)
        onStepCorrect();
        setAddedItems((prev) => [...prev, step.completionEmoji]);
        setStepCompleted(true);

        setTimeout(() => {
          if (isLastStep) {
            onComplete(errors);
          } else {
            setStepIndex((i) => i + 1);
            setStepCompleted(false);
          }
        }, 1000);
      } else {
        // Wrong item
        onStepWrong();
        setWrongItem(item);
        setErrors((e) => e + 1);
        setTimeout(() => setWrongItem(null), 600);
      }
    },
    [step, stepCompleted, isLastStep, errors, onStepCorrect, onStepWrong, onComplete]
  );

  const instruction = step.instruction[language] || step.instruction.en;

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm">
      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`bg-gradient-to-r ${recipe.color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${((stepIndex + (stepCompleted ? 1 : 0)) / recipe.steps.length) * 100}%` }}
        />
      </div>

      {/* Cooking zone */}
      <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-6 w-full text-center">
        {/* Container (plate/bowl/blender) */}
        <div className="relative w-32 h-32 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center border-3 border-dashed border-gray-200">
          {addedItems.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-1">
              {addedItems.map((item, i) => (
                <span key={i} className="text-3xl animate-bounce-in" style={{ animationDelay: `${i * 100}ms` }}>
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-4xl opacity-30">
              {step.targetZone === "bowl" ? "🥣" : step.targetZone === "blender" ? "🫙" : "🍽️"}
            </span>
          )}
        </div>

        {/* Instruction */}
        <p className="text-lg font-extrabold text-gray-800 mb-1 animate-slide-up">
          {instruction}
        </p>
        <p className="text-sm text-gray-500 font-semibold">
          Step {stepIndex + 1} of {recipe.steps.length}
        </p>
      </div>

      {/* Ingredient options */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {step.items.map((item) => {
          let style =
            "bg-white border-2 border-gray-200 shadow-md hover:scale-110 hover:shadow-lg";

          if (stepCompleted && item === step.items[0]) {
            style =
              "bg-gradient-to-b from-green-400 to-green-500 border-2 border-green-400 shadow-lg shadow-green-500/30 scale-110";
          } else if (wrongItem === item) {
            style =
              "bg-gradient-to-b from-red-400 to-red-500 border-2 border-red-400 shadow-lg animate-wiggle";
          }

          return (
            <button
              key={item}
              onClick={() => handleItemTap(item)}
              disabled={stepCompleted}
              className={`rounded-2xl py-4 text-4xl transition-all min-h-[80px] btn-3d ${style}`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
