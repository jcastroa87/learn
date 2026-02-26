"use client";

const COLORS = [
  "#FF0000", "#FF7700", "#FFAA00", "#FFFF00",
  "#00CC00", "#00AAFF", "#0044FF", "#8800FF",
  "#FF00FF", "#FF69B4", "#8B4513", "#000000",
  "#FFFFFF", "#808080",
];

interface ColorPaletteProps {
  activeColor: string;
  rainbow: boolean;
  onColorSelect: (color: string) => void;
  onRainbowToggle: () => void;
}

export default function ColorPalette({
  activeColor,
  rainbow,
  onColorSelect,
  onRainbowToggle,
}: ColorPaletteProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={`w-9 h-9 rounded-full border-2 transition-transform min-h-[44px] min-w-[44px] flex items-center justify-center ${
            !rainbow && activeColor === color
              ? "border-zinc-800 scale-110"
              : "border-zinc-200"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
      <button
        onClick={onRainbowToggle}
        className={`w-9 h-9 rounded-full border-2 transition-transform min-h-[44px] min-w-[44px] flex items-center justify-center text-sm ${
          rainbow ? "border-zinc-800 scale-110" : "border-zinc-200"
        }`}
        style={{
          background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
        }}
      >
        🌈
      </button>
    </div>
  );
}
