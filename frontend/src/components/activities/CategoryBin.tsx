"use client";

interface CategoryBinProps {
  label: string;
  icon: string;
  items: { content: string }[];
  isOver: boolean;
}

export default function CategoryBin({
  label,
  icon,
  items,
  isOver,
}: CategoryBinProps) {
  return (
    <div
      className={`flex-1 rounded-2xl border-2 p-3 min-h-[120px] transition-colors ${
        isOver
          ? "border-indigo-400 bg-indigo-50"
          : "border-zinc-200 bg-zinc-50"
      }`}
    >
      <div className="text-center mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-sm font-medium text-zinc-700">{label}</p>
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        {items.map((item, idx) => (
          <span key={idx} className="text-2xl">
            {item.content}
          </span>
        ))}
      </div>
    </div>
  );
}
