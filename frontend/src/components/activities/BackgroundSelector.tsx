"use client";

const BASE_BACKGROUNDS = [
  { id: "white", label: "White", color: "#FFFFFF" },
  { id: "cream", label: "Cream", color: "#FFF8DC" },
  { id: "sky", label: "Sky", color: "#87CEEB" },
  { id: "grass", label: "Grass", color: "#90EE90" },
  { id: "sand", label: "Sand", color: "#F4E4BA" },
  { id: "sunset", label: "Sunset", color: "#FFB347" },
  { id: "lavender", label: "Lavender", color: "#E6E6FA" },
  { id: "coral", label: "Coral", color: "#FFB4A2" },
];

interface BackgroundSelectorProps {
  activeBackground: string;
  onSelect: (color: string) => void;
  unlockedBackgrounds?: { id: string; color: string; label: string }[];
}

export default function BackgroundSelector({
  activeBackground,
  onSelect,
  unlockedBackgrounds = [],
}: BackgroundSelectorProps) {
  const allBackgrounds = [...BASE_BACKGROUNDS, ...unlockedBackgrounds];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {allBackgrounds.map((bg) => (
        <button
          key={bg.id}
          onClick={() => onSelect(bg.color)}
          className={`w-10 h-10 rounded-lg border-2 transition-transform min-h-[44px] min-w-[44px] ${
            activeBackground === bg.color
              ? "border-zinc-800 scale-110"
              : "border-zinc-200"
          }`}
          style={{ backgroundColor: bg.color }}
          title={bg.label}
        />
      ))}
    </div>
  );
}
