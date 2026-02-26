"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { ModuleType } from "@/types";

const MODULE_ICONS: Record<ModuleType, string> = {
  letter_tracing: "✏️",
  number_tracing: "🔢",
  matching: "🔗",
  coloring: "🎨",
  free_drawing: "🖌️",
  memory_cards: "🃏",
  puzzles: "🧩",
  fill_the_gaps: "🧱",
  sorting: "📦",
};

const MODULE_ROUTES: Record<ModuleType, string> = {
  letter_tracing: "/activities/letter-tracing",
  number_tracing: "/activities/number-tracing",
  matching: "/activities/matching",
  coloring: "/activities/coloring",
  free_drawing: "/activities/free-drawing",
  memory_cards: "/activities/memory-cards",
  puzzles: "/activities/puzzles",
  fill_the_gaps: "/activities/fill-the-gaps",
  sorting: "/activities/sorting",
};

const MODULE_COLORS: Record<ModuleType, string> = {
  letter_tracing: "from-pink-100 to-pink-50",
  number_tracing: "from-blue-100 to-blue-50",
  matching: "from-purple-100 to-purple-50",
  coloring: "from-yellow-100 to-yellow-50",
  free_drawing: "from-orange-100 to-orange-50",
  memory_cards: "from-green-100 to-green-50",
  puzzles: "from-teal-100 to-teal-50",
  fill_the_gaps: "from-indigo-100 to-indigo-50",
  sorting: "from-rose-100 to-rose-50",
};

interface ActivityCardProps {
  module: ModuleType;
  progress?: { completed: number; total: number };
}

export default function ActivityCard({ module, progress }: ActivityCardProps) {
  const { t } = useTranslation("activities");

  const progressPct =
    progress && progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return (
    <Link href={MODULE_ROUTES[module]}>
      <div
        className={`bg-gradient-to-b ${MODULE_COLORS[module]} rounded-2xl p-4 text-center cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all min-h-[120px] flex flex-col items-center justify-center gap-2`}
      >
        <span className="text-3xl">{MODULE_ICONS[module]}</span>
        <span className="font-semibold text-sm text-zinc-700">
          {t(module)}
        </span>
        {progress && progress.total > 0 && (
          <div className="w-full bg-white/60 rounded-full h-1.5 mt-1">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
