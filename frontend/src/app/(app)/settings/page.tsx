"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";

export default function SettingsPage() {
  const { t } = useTranslation("ui");
  const router = useRouter();
  const { user, logout, deleteAccount } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteAccount();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            ← {t("back")}
          </Button>
          <h1 className="text-xl font-bold">{t("settings")}</h1>
        </div>

        <Card padding="md" className="mb-4">
          <p className="text-sm text-zinc-500 mb-1">{t("email")}</p>
          <p className="font-medium">{user?.email}</p>
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
          <h2 className="text-lg font-bold mb-2">{t("delete_account")}</h2>
          <p className="text-zinc-500 text-sm mb-6">
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
