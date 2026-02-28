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
    <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onSelect(mode)}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all min-h-[44px] ${
            activeMode === mode
              ? "bg-gradient-to-b from-indigo-400 to-indigo-500 text-white shadow-md shadow-indigo-500/30 scale-105"
              : "bg-white text-gray-600 border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm"
          }`}
        >
          <span className="text-lg">{MODE_ICONS[mode] || "📋"}</span>
          <span>{t(mode)}</span>
        </button>
      ))}
    </div>
  );
}
