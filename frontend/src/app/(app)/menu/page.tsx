"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import TopBar from "@/components/layout/TopBar";
import ActivityCard from "@/components/layout/ActivityCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { Language, ModuleType } from "@/types";

const MODULES: ModuleType[] = [
  "letter_tracing",
  "number_tracing",
  "abc_puzzles",
  "matching",
  "coloring",
  "free_drawing",
  "memory_cards",
  "puzzles",
  "fill_the_gaps",
  "sorting",
  "cooking",
];

export default function MenuPage() {
  const { t } = useTranslation("ui");
  const router = useRouter();
  const { activeChild, loading, updateChild, switchChild } = useChildProfile();

  useEffect(() => {
    if (!loading && !activeChild) {
      router.replace("/profiles");
    }
  }, [activeChild, loading, router]);

  if (loading || !activeChild) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  async function handleLanguageChange(lang: Language) {
    if (!activeChild) return;
    const res = await updateChild(activeChild.id, { language: lang });
    if (res.success) {
      switchChild(res.data);
    }
  }

  return (
    <div className="min-h-screen bg-playful flex flex-col">
      <TopBar
        child={activeChild}
        onLanguageChange={handleLanguageChange}
        onBananasTap={() => router.push("/shop")}
      />

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {MODULES.map((module) => (
            <ActivityCard key={module} module={module} />
          ))}
        </div>

        <div className="flex gap-4">
          <Link href="/shop" className="flex-1">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-5 text-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/20 btn-3d">
              <span className="text-3xl drop-shadow-md">🛍️</span>
              <p className="font-bold text-sm text-white mt-1 drop-shadow-sm">
                {t("shop")}
              </p>
            </div>
          </Link>
          <Link href="/gallery" className="flex-1">
            <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-3xl p-5 text-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20 btn-3d">
              <span className="text-3xl drop-shadow-md">🖼️</span>
              <p className="font-bold text-sm text-white mt-1 drop-shadow-sm">
                {t("gallery")}
              </p>
            </div>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-40">
        <Link
          href="/menu"
          className="flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px] justify-center px-4"
        >
          <span className="text-2xl">🏠</span>
          <span className="text-xs font-bold text-indigo-600">{t("home")}</span>
        </Link>
        <Link
          href="/profiles"
          className="flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px] justify-center px-4"
        >
          <span className="text-2xl">👦</span>
          <span className="text-xs font-semibold text-gray-500">{t("profiles")}</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px] justify-center px-4"
        >
          <span className="text-2xl">📊</span>
          <span className="text-xs font-semibold text-gray-500">{t("dashboard")}</span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px] justify-center px-4"
        >
          <span className="text-2xl">⚙️</span>
          <span className="text-xs font-semibold text-gray-500">{t("settings")}</span>
        </Link>
      </nav>
    </div>
  );
}
