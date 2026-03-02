"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { apiGet, apiPost } from "@/lib/api";
import CosmeticItemCard from "@/components/activities/CosmeticItemCard";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { CosmeticItem } from "@/types";

type ShopTab = "avatar" | "sticker" | "background";

const TABS: { id: ShopTab; labelKey: string; icon: string }[] = [
  { id: "avatar", labelKey: "avatars", icon: "👤" },
  { id: "sticker", labelKey: "stickers_tab", icon: "⭐" },
  { id: "background", labelKey: "backgrounds", icon: "🖼️" },
];

export default function ShopPage() {
  const { t } = useTranslation("ui");
  const router = useRouter();
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
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.push("/menu")}
          className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all min-h-[44px] min-w-[44px]"
        >
          ←
        </button>
        <h1 className="flex-1 text-2xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
          🛍️ {t("shop")}
        </h1>
        <span className="text-lg font-extrabold bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full shadow-md">
          🍌 {bananas}
        </span>
      </div>

      <div className="flex gap-2 mb-5">
        {TABS.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all min-h-[44px] ${
              tab === tabItem.id
                ? "bg-gradient-to-b from-indigo-400 to-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-indigo-300"
            }`}
          >
            {tabItem.icon} {t(tabItem.labelKey)}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner className="py-10" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
      >
        {purchasing && (
          <div className="text-center">
            <div className="text-7xl mb-4 animate-bounce-in">
              {purchasing.preview_url || previewMap[purchasing.category] || "🎁"}
            </div>
            <p className="text-gray-800 font-bold text-lg mb-1">{purchasing.name_key}</p>
            <p className="text-amber-600 font-extrabold text-xl mb-6">
              🍌 {purchasing.banana_cost}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setPurchasing(null)}>
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
