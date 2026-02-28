"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { getTemplatesByCategory, COLORING_CATEGORIES, type ColoringCategory } from "@/data/coloring";
import ModeSelector from "@/components/activities/ModeSelector";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ColoringGalleryPage() {
  const { t } = useTranslation("activities");
  const { activeChild } = useChildProfile();
  const [category, setCategory] = useState<ColoringCategory>("animals");

  if (!activeChild) return <LoadingSpinner className="py-20" />;

  const templates = getTemplatesByCategory(category);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-extrabold mb-3 text-center bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">{t("coloring")}</h1>

      <ModeSelector
        modes={COLORING_CATEGORIES}
        activeMode={category}
        onSelect={setCategory}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
        {templates.map((tmpl) => (
          <Link key={tmpl.id} href={`/activities/coloring/${tmpl.id}`}>
            <Card
              padding="sm"
              className="text-center hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-full aspect-square bg-gray-50 rounded-2xl mb-2 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {tmpl.regions.map((r) => (
                    <path
                      key={r.id}
                      d={r.path}
                      fill={r.defaultFill}
                      stroke="#aaa"
                      strokeWidth="0.8"
                    />
                  ))}
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-700">
                {tmpl.name[activeChild.language] || tmpl.name.en}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
