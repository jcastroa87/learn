"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import ChildProfileForm from "@/components/activities/ChildProfileForm";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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

const CARD_COLORS = [
  "from-pink-400 to-rose-500",
  "from-sky-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-emerald-400 to-green-500",
  "from-amber-400 to-orange-500",
];

export default function ProfilesPage() {
  const { t } = useTranslation("ui");
  const router = useRouter();
  const { children, loading, switchChild, createChild } = useChildProfile();
  const [showCreate, setShowCreate] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-playful">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  function handleSelectChild(child: (typeof children)[0]) {
    switchChild(child);
    router.push("/menu");
  }

  return (
    <div className="min-h-screen bg-playful p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {t("profiles")}
            </h1>
            <p className="text-gray-500 font-medium mt-1">Who&apos;s playing today?</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                📊
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                ⚙️
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-6">
          {children.map((child, i) => (
            <div
              key={child.id}
              className={`bg-gradient-to-br ${CARD_COLORS[i % CARD_COLORS.length]} rounded-3xl p-6 text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg btn-3d animate-slide-up`}
              style={{ animationDelay: `${i * 100}ms` }}
              onClick={() => handleSelectChild(child)}
            >
              <div className="text-5xl mb-3 animate-float">
                {AVATAR_EMOJIS[child.avatar] || "🦍"}
              </div>
              <p className="font-extrabold text-lg text-white drop-shadow-sm">{child.name}</p>
              <p className="text-sm text-white/80 font-semibold">
                {child.age} {t("age").toLowerCase()}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                <span className="text-sm">🍌</span>
                <span className="text-sm font-bold text-white">{child.bananas}</span>
              </div>
            </div>
          ))}

          {children.length < 5 && (
            <div
              className="rounded-3xl p-6 text-center cursor-pointer hover:scale-105 active:scale-95 transition-all border-3 border-dashed border-gray-300 bg-white/50 flex flex-col items-center justify-center shadow-md animate-slide-up"
              style={{ animationDelay: `${children.length * 100}ms` }}
              onClick={() => setShowCreate(true)}
            >
              <div className="text-5xl mb-3 text-gray-300">+</div>
              <p className="text-gray-400 font-bold">{t("add_profile")}</p>
            </div>
          )}
        </div>

        <Modal open={showCreate} onClose={() => setShowCreate(false)}>
          <h2 className="text-xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {t("add_profile")}
          </h2>
          <ChildProfileForm
            onSubmit={async (data) => {
              await createChild(data);
              setShowCreate(false);
            }}
            onCancel={() => setShowCreate(false)}
          />
        </Modal>
      </div>
    </div>
  );
}
