"use client";

import { useTranslation } from "react-i18next";
import type { ChildProfile, Language } from "@/types";

const AVATAR_EMOJIS: Record<string, string> = {
  gorilla: "🦍",
  panda: "🐼",
  bunny: "🐰",
  lion: "🦁",
  elephant: "🐘",
  penguin: "🐧",
  fox: "🦊",
  cat: "🐱",
};

const LANGUAGES: { value: Language; flag: string }[] = [
  { value: "es", flag: "🇪🇸" },
  { value: "en", flag: "🇺🇸" },
  { value: "ru", flag: "🇷🇺" },
];

interface TopBarProps {
  child: ChildProfile;
  onLanguageChange?: (lang: Language) => void;
  onBananasTap?: () => void;
}

export default function TopBar({
  child,
  onLanguageChange,
  onBananasTap,
}: TopBarProps) {
  const { i18n } = useTranslation();

  function handleLanguageSwitch(lang: Language) {
    i18n.changeLanguage(lang);
    onLanguageChange?.(lang);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">
          {AVATAR_EMOJIS[child.avatar] || "🦍"}
        </div>
        <span className="font-semibold text-zinc-800">{child.name}</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onBananasTap}
          className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full min-h-[44px]"
        >
          <span className="text-lg">🍌</span>
          <span className="font-bold text-amber-700">{child.bananas}</span>
        </button>

        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => handleLanguageSwitch(lang.value)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all min-h-[44px] min-w-[44px] ${
                i18n.language === lang.value
                  ? "bg-emerald-100 scale-110"
                  : "hover:bg-zinc-100"
              }`}
            >
              {lang.flag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
