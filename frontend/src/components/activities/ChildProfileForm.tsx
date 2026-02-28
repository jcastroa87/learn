"use client";

import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import type { ChildProfile, Language } from "@/types";

const AVATARS = [
  "gorilla",
  "panda",
  "bunny",
  "lion",
  "elephant",
  "penguin",
  "fox",
  "cat",
];

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

const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: "es", label: "spanish", flag: "🇪🇸" },
  { value: "en", label: "english", flag: "🇺🇸" },
  { value: "ru", label: "russian", flag: "🇷🇺" },
];

const AGE_COLORS = [
  "from-pink-400 to-rose-500",
  "from-sky-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-green-500",
  "from-teal-400 to-cyan-500",
  "from-indigo-400 to-indigo-500",
];

interface ChildProfileFormProps {
  initialData?: ChildProfile;
  onSubmit: (data: {
    name: string;
    age: number;
    avatar: string;
    language: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ChildProfileForm({
  initialData,
  onSubmit,
  onCancel,
}: ChildProfileFormProps) {
  const { t } = useTranslation("ui");

  const [name, setName] = useState(initialData?.name || "");
  const [age, setAge] = useState(initialData?.age || 3);
  const [avatar, setAvatar] = useState(initialData?.avatar || "gorilla");
  const [language, setLanguage] = useState<Language>(
    initialData?.language || "es"
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ name, age, avatar, language });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-gray-600 mb-1">
          {t("name")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          required
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-600 mb-2">
          {t("age")}
        </label>
        <div className="flex items-center gap-2">
          {[2, 3, 4, 5, 6, 7, 8].map((a, i) => (
            <button
              key={a}
              type="button"
              onClick={() => setAge(a)}
              className={`w-12 h-12 rounded-2xl text-lg font-extrabold transition-all ${
                age === a
                  ? `bg-gradient-to-b ${AGE_COLORS[i]} text-white shadow-lg scale-110`
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-600 mb-2">
          {t("avatar")}
        </label>
        <div className="flex flex-wrap gap-3">
          {AVATARS.map((av) => (
            <button
              key={av}
              type="button"
              onClick={() => setAvatar(av)}
              className={`w-16 h-16 rounded-2xl text-3xl flex items-center justify-center transition-all ${
                avatar === av
                  ? "bg-indigo-100 ring-3 ring-indigo-500 scale-110 shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200 hover:scale-105"
              }`}
            >
              {AVATAR_EMOJIS[av] || "🦍"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-600 mb-2">
          {t("language")}
        </label>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => setLanguage(lang.value)}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                language === lang.value
                  ? "bg-gradient-to-b from-indigo-400 to-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="mr-1">{lang.flag}</span> {t(lang.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          {t("cancel")}
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
