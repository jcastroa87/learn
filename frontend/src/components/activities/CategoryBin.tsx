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
      className={`flex-1 rounded-3xl border-3 p-4 min-h-[130px] transition-all ${
        isOver
          ? "border-indigo-400 bg-indigo-50 scale-105 shadow-lg shadow-indigo-500/20"
          : "border-gray-200 bg-white shadow-md"
      }`}
    >
      <div className="text-center mb-2">
        <span className="text-3xl drop-shadow-sm">{icon}</span>
        <p className="text-sm font-bold text-gray-700 mt-1">{label}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {items.map((item, idx) => (
          <span key={idx} className="text-2xl animate-bounce-in">
            {item.content}
          </span>
        ))}
      </div>
    </div>
  );
}
