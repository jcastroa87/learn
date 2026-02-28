"use client";

interface CosmeticItemCardProps {
  name: string;
  preview: string;
  cost: number;
  owned: boolean;
  canAfford: boolean;
  onPurchase: () => void;
}

export default function CosmeticItemCard({
  name,
  preview,
  cost,
  owned,
  canAfford,
  onPurchase,
}: CosmeticItemCardProps) {
  return (
    <div
      className={`rounded-3xl border-2 p-4 text-center transition-all ${
        owned
          ? "border-green-300 bg-green-50 shadow-md"
          : canAfford
            ? "border-gray-200 bg-white hover:shadow-lg hover:scale-105 cursor-pointer shadow-md"
            : "border-gray-100 bg-gray-50 opacity-60 shadow-sm"
      }`}
    >
      <div className="text-5xl mb-3">{preview}</div>
      <p className="text-sm font-bold text-gray-700 mb-2">{name}</p>
      {owned ? (
        <span className="text-sm text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full">
          ✓ Owned
        </span>
      ) : (
        <button
          onClick={onPurchase}
          disabled={!canAfford}
          className={`text-sm font-bold px-4 py-2 rounded-2xl min-h-[44px] transition-all ${
            canAfford
              ? "bg-gradient-to-b from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600 shadow-md shadow-amber-500/30 btn-3d"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          🍌 {cost}
        </button>
      )}
    </div>
  );
}
