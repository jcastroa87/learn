"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { apiGet, apiPost } from "@/lib/api";
import CosmeticItemCard from "@/components/activities/CosmeticItemCard";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { CosmeticItem } from "@/types";

type ShopTab = "avatar" | "sticker" | "background";

const TABS: { id: ShopTab; label: string; icon: string }[] = [
  { id: "avatar", label: "Avatars", icon: "👤" },
  { id: "sticker", label: "Stickers", icon: "⭐" },
  { id: "background", label: "Backgrounds", icon: "🖼️" },
];

export default function ShopPage() {
  const { t } = useTranslation("ui");
  const { activeChild, refreshActiveChild } = useChildProfile();
  const [tab, setTab] = useState<ShopTab>("avatar");
  const [allItems, setAllItems] = useState<CosmeticItem[]>([]);
  const [ownedIds, setOwnedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<CosmeticItem | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  useEffect(() => {
    if (!activeChild) return;

    const load = async () => {
      setLoading(true);
      const [itemsRes, ownedRes] = await Promise.all([
        apiGet<CosmeticItem[]>(`/api/cosmetics?category=${tab}&per_page=50`),
        apiGet<CosmeticItem[]>(`/api/children/${activeChild.id}/cosmetics?per_page=100`),
      ]);

      if (itemsRes.success) {
        setAllItems(itemsRes.data ?? []);
      }
      if (ownedRes.success) {
        const ids = (ownedRes.data ?? []).map((c) => c.id);
        setOwnedIds(new Set(ids));
      }
      setLoading(false);
    };

    load();
  }, [activeChild, tab]);

  const handlePurchase = useCallback(async () => {
    if (!purchasing || !activeChild) return;
    setPurchaseLoading(true);

    const res = await apiPost<{ cosmetic_id: number; new_banana_total: number }>(
      `/api/children/${activeChild.id}/cosmetics/${purchasing.id}/purchase`
    );

    if (res.success) {
      setOwnedIds((prev) => new Set([...prev, purchasing.id]));
      refreshActiveChild?.();
    }
    setPurchaseLoading(false);
    setPurchasing(null);
  }, [purchasing, activeChild, refreshActiveChild]);

  if (!activeChild) return <LoadingSpinner className="py-20" />;

  const bananas = activeChild.bananas ?? 0;

  const previewMap: Record<string, string> = {
    avatar: "👤",
    sticker: "⭐",
    background: "🖼️",
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{t("shop")}</h1>
        <span className="text-lg font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
          🍌 {bananas}
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
              tab === t.id
                ? "bg-indigo-500 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner className="py-10" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allItems.map((item) => (
            <CosmeticItemCard
              key={item.id}
              name={item.name_key}
              preview={item.preview_url || previewMap[item.category] || "🎁"}
              cost={item.banana_cost}
              owned={ownedIds.has(item.id)}
              canAfford={bananas >= item.banana_cost}
              onPurchase={() => setPurchasing(item)}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!purchasing}
        onClose={() => setPurchasing(null)}
        title={t("confirm_purchase")}
      >
        {purchasing && (
          <div className="text-center">
            <div className="text-6xl mb-3">
              {purchasing.preview_url || previewMap[purchasing.category] || "🎁"}
            </div>
            <p className="text-zinc-700 mb-1">{purchasing.name_key}</p>
            <p className="text-amber-600 font-semibold mb-4">
              🍌 {purchasing.banana_cost}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="ghost" onClick={() => setPurchasing(null)}>
                {t("cancel")}
              </Button>
              <Button
                variant="primary"
                loading={purchaseLoading}
                onClick={handlePurchase}
              >
                {t("buy")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
