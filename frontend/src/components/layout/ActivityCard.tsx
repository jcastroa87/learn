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
  abc_puzzles: "🔤",
  cooking: "🍳",
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
  abc_puzzles: "/activities/abc-puzzles",
  cooking: "/activities/cooking",
};

const MODULE_COLORS: Record<ModuleType, { gradient: string; shadow: string }> = {
  letter_tracing: { gradient: "from-pink-400 to-rose-500", shadow: "shadow-pink-500/30" },
  number_tracing: { gradient: "from-sky-400 to-blue-500", shadow: "shadow-blue-500/30" },
  matching: { gradient: "from-violet-400 to-purple-500", shadow: "shadow-purple-500/30" },
  coloring: { gradient: "from-amber-300 to-yellow-500", shadow: "shadow-yellow-500/30" },
  free_drawing: { gradient: "from-orange-400 to-orange-500", shadow: "shadow-orange-500/30" },
  memory_cards: { gradient: "from-emerald-400 to-green-500", shadow: "shadow-green-500/30" },
  puzzles: { gradient: "from-teal-400 to-cyan-500", shadow: "shadow-cyan-500/30" },
  fill_the_gaps: { gradient: "from-indigo-400 to-indigo-500", shadow: "shadow-indigo-500/30" },
  sorting: { gradient: "from-rose-400 to-pink-500", shadow: "shadow-pink-500/30" },
  abc_puzzles: { gradient: "from-fuchsia-400 to-purple-500", shadow: "shadow-purple-500/30" },
  cooking: { gradient: "from-red-400 to-orange-500", shadow: "shadow-orange-500/30" },
};

interface ActivityCardProps {
  module: ModuleType;
  progress?: { completed: number; total: number };
}

export default function ActivityCard({ module, progress }: ActivityCardProps) {
  const { t } = useTranslation("activities");
  const colors = MODULE_COLORS[module];

  const progressPct =
    progress && progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return (
    <Link href={MODULE_ROUTES[module]}>
      <div
        className={`bg-gradient-to-br ${colors.gradient} rounded-3xl p-5 text-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 min-h-[140px] flex flex-col items-center justify-center gap-2 shadow-lg ${colors.shadow} btn-3d`}
      >
        <span className="text-4xl drop-shadow-md">{MODULE_ICONS[module]}</span>
        <span className="font-bold text-sm text-white drop-shadow-sm">
          {t(module)}
        </span>
        {progress && progress.total > 0 && (
          <div className="w-full bg-white/30 rounded-full h-2 mt-1">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
