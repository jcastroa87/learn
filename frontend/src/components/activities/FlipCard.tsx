"use client";

interface FlipCardProps {
  content: string;
  faceUp: boolean;
  matched: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function FlipCard({
  content,
  faceUp,
  matched,
  selected,
  onClick,
}: FlipCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={faceUp || matched}
      className={`relative w-full aspect-square rounded-xl transition-transform duration-300 min-h-[44px] min-w-[44px] ${
        matched ? "opacity-60 scale-95" : selected ? "ring-2 ring-indigo-400" : ""
      }`}
      style={{ perspective: "600px" }}
    >
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: faceUp ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Back of card */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-3xl text-white">?</span>
        </div>

        {/* Front of card */}
        <div
          className={`absolute inset-0 rounded-xl flex items-center justify-center shadow-md text-2xl font-bold ${
            matched ? "bg-green-100 border-2 border-green-300" : "bg-white border-2 border-zinc-200"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {content}
        </div>
      </div>
    </button>
  );
}
