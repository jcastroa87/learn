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
      className={`relative w-full aspect-square rounded-2xl transition-transform duration-300 min-h-[44px] min-w-[44px] ${
        matched
          ? "opacity-70 scale-95"
          : selected
            ? "ring-3 ring-yellow-400 ring-offset-2"
            : ""
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
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 btn-3d"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-4xl text-white drop-shadow-md">?</span>
        </div>

        {/* Front of card */}
        <div
          className={`absolute inset-0 rounded-2xl flex items-center justify-center shadow-lg text-3xl font-bold ${
            matched
              ? "bg-green-50 border-3 border-green-400"
              : "bg-white border-3 border-indigo-200"
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
