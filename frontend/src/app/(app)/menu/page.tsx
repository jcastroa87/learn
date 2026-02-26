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
  "matching",
  "coloring",
  "free_drawing",
  "memory_cards",
  "puzzles",
  "fill_the_gaps",
  "sorting",
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
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <TopBar
        child={activeChild}
        onLanguageChange={handleLanguageChange}
        onBananasTap={() => router.push("/shop")}
      />

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {MODULES.map((module) => (
            <ActivityCard key={module} module={module} />
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/shop" className="flex-1">
            <div className="bg-gradient-to-b from-amber-100 to-amber-50 rounded-2xl p-4 text-center hover:shadow-md transition-all">
              <span className="text-2xl">🛍️</span>
              <p className="font-semibold text-sm text-zinc-700 mt-1">
                {t("shop")}
              </p>
            </div>
          </Link>
          <Link href="/gallery" className="flex-1">
            <div className="bg-gradient-to-b from-sky-100 to-sky-50 rounded-2xl p-4 text-center hover:shadow-md transition-all">
              <span className="text-2xl">🖼️</span>
              <p className="font-semibold text-sm text-zinc-700 mt-1">
                {t("gallery")}
              </p>
            </div>
          </Link>
        </div>
      </main>

      <nav className="flex justify-center gap-4 py-3 border-t border-zinc-100 bg-white">
        <Link
          href="/profiles"
          className="text-sm text-zinc-500 hover:text-zinc-700 min-h-[44px] flex items-center px-3"
        >
          {t("profiles")}
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-500 hover:text-zinc-700 min-h-[44px] flex items-center px-3"
        >
          {t("dashboard")}
        </Link>
      </nav>
    </div>
  );
}
