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
      className={`rounded-xl border p-3 text-center transition-shadow ${
        owned
          ? "border-green-200 bg-green-50"
          : canAfford
            ? "border-zinc-200 bg-white hover:shadow-md cursor-pointer"
            : "border-zinc-100 bg-zinc-50 opacity-60"
      }`}
    >
      <div className="text-4xl mb-2">{preview}</div>
      <p className="text-sm font-medium text-zinc-700 mb-1">{name}</p>
      {owned ? (
        <span className="text-xs text-green-600 font-medium">✓ Owned</span>
      ) : (
        <button
          onClick={onPurchase}
          disabled={!canAfford}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg min-h-[44px] transition-colors ${
            canAfford
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
          }`}
        >
          🍌 {cost}
        </button>
      )}
    </div>
  );
}
