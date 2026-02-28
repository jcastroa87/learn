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
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center text-2xl shadow-md animate-float">
          {AVATAR_EMOJIS[child.avatar] || "🦍"}
        </div>
        <span className="font-bold text-white text-lg drop-shadow-sm">
          {child.name}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onBananasTap}
          className="flex items-center gap-1.5 bg-yellow-400 px-4 py-2 rounded-full min-h-[44px] shadow-md btn-3d hover:bg-yellow-300 transition-colors"
        >
          <span className="text-lg">🍌</span>
          <span className="font-extrabold text-yellow-900">{child.bananas}</span>
        </button>

        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => handleLanguageSwitch(lang.value)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all min-h-[44px] min-w-[44px] ${
                i18n.language === lang.value
                  ? "bg-white/90 scale-110 shadow-md"
                  : "bg-white/20 hover:bg-white/40"
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
