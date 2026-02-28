"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { PUZZLE_CATEGORIES, getPuzzlesByCategory, type PuzzleCategory } from "@/data/puzzles";
import ModeSelector from "@/components/activities/ModeSelector";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function PuzzlesGalleryPage() {
  const { t } = useTranslation("activities");
  const { activeChild } = useChildProfile();
  const [category, setCategory] = useState<PuzzleCategory>("animals");

  if (!activeChild) return <LoadingSpinner className="py-20" />;

  const puzzles = getPuzzlesByCategory(category);
  const lang = activeChild.language || "es";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-extrabold mb-3 text-center bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">{t("puzzles")}</h1>

      <ModeSelector
        modes={PUZZLE_CATEGORIES as unknown as string[]}
        activeMode={category}
        onSelect={setCategory as (mode: string) => void}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
        {puzzles.map((puzzle) => (
          <Link key={puzzle.id} href={`/activities/puzzles/${puzzle.id}`}>
            <Card
              padding="sm"
              className="text-center hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-full aspect-square rounded-2xl mb-2 flex items-center justify-center text-5xl"
                style={{ backgroundColor: puzzle.gridColor + "44" }}
              >
                {puzzle.image}
              </div>
              <p className="text-sm font-bold text-gray-700">
                {puzzle.name[lang] || puzzle.name.en}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
