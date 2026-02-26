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

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "es", label: "spanish" },
  { value: "en", label: "english" },
  { value: "ru", label: "russian" },
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
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          {t("name")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
          required
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          {t("age")}
        </label>
        <div className="flex items-center gap-3">
          {[2, 3, 4, 5, 6, 7, 8].map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAge(a)}
              className={`w-11 h-11 rounded-full text-lg font-bold transition-colors ${
                age === a
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          {t("avatar")}
        </label>
        <div className="flex flex-wrap gap-3">
          {AVATARS.map((av) => (
            <button
              key={av}
              type="button"
              onClick={() => setAvatar(av)}
              className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                avatar === av
                  ? "bg-emerald-100 ring-2 ring-emerald-500 scale-110"
                  : "bg-zinc-100 hover:bg-zinc-200"
              }`}
            >
              {AVATAR_EMOJIS[av] || "🦍"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          {t("language")}
        </label>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => setLanguage(lang.value)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                language === lang.value
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {t(lang.label)}
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
