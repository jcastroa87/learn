"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import ParentalGate from "@/components/ui/ParentalGate";

export default function SettingsPage() {
  const { t } = useTranslation("ui");
  const router = useRouter();
  const { user, logout, deleteAccount } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [gateUnlocked, setGateUnlocked] = useState(false);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteAccount();
    router.replace("/login");
  }

  if (!gateUnlocked) {
    return (
      <ParentalGate
        onPass={() => setGateUnlocked(true)}
        onCancel={() => router.back()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-playful p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            ←
          </Button>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {t("settings")}
          </h1>
        </div>

        <Card padding="md" className="mb-4">
          <p className="text-sm text-gray-500 font-semibold mb-1">{t("email")}</p>
          <p className="font-bold text-gray-800">{user?.email}</p>
        </Card>

        <Button
          variant="secondary"
          className="w-full mb-4"
          onClick={handleLogout}
        >
          {t("logout")}
        </Button>

        <Button
          variant="danger"
          className="w-full"
          onClick={() => setShowDeleteConfirm(true)}
        >
          {t("delete_account")}
        </Button>

        <Modal
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
        >
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">⚠️</div>
            <h2 className="text-xl font-extrabold text-gray-800">{t("delete_account")}</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6 text-center">
            {t("delete_account_confirm")}
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowDeleteConfirm(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={deleting}
              onClick={handleDelete}
            >
              {t("delete")}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
