"use client";

import type { MemoryDifficulty } from "./MemoryCardGrid";

interface MemoryModeSelectorProps {
  modes: { id: string; label: string; icon: string }[];
  activeMode: string;
  onModeSelect: (mode: string) => void;
  difficulty: MemoryDifficulty;
  onDifficultySelect: (d: MemoryDifficulty) => void;
}

const DIFFICULTIES: { id: MemoryDifficulty; label: string; grid: string }[] = [
  { id: "easy", label: "2×3", grid: "3 pairs" },
  { id: "medium", label: "3×4", grid: "6 pairs" },
  { id: "hard", label: "4×4", grid: "8 pairs" },
];

export default function MemoryModeSelector({
  modes,
  activeMode,
  onModeSelect,
  difficulty,
  onDifficultySelect,
}: MemoryModeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 justify-center flex-wrap">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeSelect(mode.id)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
              activeMode === mode.id
                ? "bg-indigo-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <span className="mr-1">{mode.icon}</span>
            {mode.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 justify-center">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.id}
            onClick={() => onDifficultySelect(d.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
              difficulty === d.id
                ? "bg-amber-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
