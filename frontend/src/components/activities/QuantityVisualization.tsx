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
    <div className="flex flex-wrap justify-center gap-3 py-4">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="text-3xl animate-bounce-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
