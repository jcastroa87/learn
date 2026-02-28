"use client";

import Modal from "./Modal";
import Button from "./Button";
import { useTranslation } from "react-i18next";

interface ArtworkLimitDialogProps {
  open: boolean;
  currentCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ArtworkLimitDialog({
  open,
  currentCount,
  onConfirm,
  onCancel,
}: ArtworkLimitDialogProps) {
  const { t } = useTranslation("ui");

  return (
    <Modal open={open} onClose={onCancel}>
      <div className="text-center">
        <div className="text-5xl mb-3">🎨</div>
        <h2 className="text-xl font-extrabold text-gray-800 mb-3">{t("artwork_limit_title")}</h2>
        <p className="text-gray-700 mb-2">
          {t("artwork_limit_message", { count: currentCount, max: 50 })}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {t("artwork_limit_replace")}
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="ghost" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {t("save_anyway")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
