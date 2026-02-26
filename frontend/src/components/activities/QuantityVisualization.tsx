"use client";

const EMOJIS = ["🍎", "⭐", "🌸", "🐟", "🦋", "🍊", "💎", "🌙", "🎈", "🐝"];

interface QuantityVisualizationProps {
  count: number;
}

export default function QuantityVisualization({
  count,
}: QuantityVisualizationProps) {
  const emoji = EMOJIS[count % EMOJIS.length];

  return (
    <div className="flex flex-wrap justify-center gap-2 py-3">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="text-2xl">
          {emoji}
        </span>
      ))}
    </div>
  );
}
