"use client";

import { useTranslation } from "react-i18next";
import Button from "./Button";

interface EmptyStateProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { t } = useTranslation("ui");

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4">🦍</div>
      <p className="text-zinc-500 text-lg mb-6">{message || t("no_data")}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
