"use client";

import { useTranslation } from "react-i18next";

interface ModeSelectorProps<T extends string> {
  modes: T[];
  activeMode: T;
  onSelect: (mode: T) => void;
}

const MODE_ICONS: Record<string, string> = {
  letters: "🔤",
  numbers: "🔢",
  colors: "🎨",
  shapes: "🔷",
  animals: "🐾",
  vehicles: "🚗",
  nature: "🌿",
  food: "🍎",
  fantasy: "🦄",
  farm: "🏡",
  ocean: "🌊",
  space: "🚀",
  kitchen: "🍳",
};

export default function ModeSelector<T extends string>({
  modes,
  activeMode,
  onSelect,
}: ModeSelectorProps<T>) {
  const { t } = useTranslation("activities");

  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-1">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onSelect(mode)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
            activeMode === mode
              ? "bg-emerald-500 text-white"
              : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <span>{MODE_ICONS[mode] || "📋"}</span>
          <span>{t(mode)}</span>
        </button>
      ))}
    </div>
  );
}
