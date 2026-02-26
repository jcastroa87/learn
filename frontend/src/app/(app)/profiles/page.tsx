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

export default function ProfilesPage() {
  const { t } = useTranslation("ui");
  const router = useRouter();
  const { children, loading, switchChild, createChild } = useChildProfile();
  const [showCreate, setShowCreate] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  function handleSelectChild(child: (typeof children)[0]) {
    switchChild(child);
    router.push("/menu");
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{t("profiles")}</h1>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                {t("dashboard")}
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                ⚙️
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {children.map((child) => (
            <Card
              key={child.id}
              padding="md"
              className="cursor-pointer hover:shadow-md transition-shadow text-center"
              onClick={() => handleSelectChild(child)}
            >
              <div className="text-4xl mb-2">
                {AVATAR_EMOJIS[child.avatar] || "🦍"}
              </div>
              <p className="font-semibold text-lg">{child.name}</p>
              <p className="text-sm text-zinc-500">
                {child.age} {t("age").toLowerCase()}
              </p>
              <p className="text-sm text-amber-600 mt-1">
                🍌 {child.bananas}
              </p>
            </Card>
          ))}

          {children.length < 5 && (
            <Card
              padding="md"
              className="cursor-pointer hover:shadow-md transition-shadow text-center border-dashed border-2 border-zinc-200 flex flex-col items-center justify-center"
              onClick={() => setShowCreate(true)}
            >
              <div className="text-4xl mb-2 text-zinc-300">+</div>
              <p className="text-zinc-400 font-medium">{t("add_profile")}</p>
            </Card>
          )}
        </div>

        <Modal open={showCreate} onClose={() => setShowCreate(false)}>
          <h2 className="text-lg font-bold mb-4">{t("add_profile")}</h2>
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
