"use client";

import { useTranslation } from "react-i18next";
import Button from "./Button";

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { t } = useTranslation("ui");

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-7xl mb-4 animate-float">{icon || "🦍"}</div>
      <p className="text-gray-800 text-xl font-extrabold mb-2">
        {title || message || t("no_data")}
      </p>
      {description && (
        <p className="text-gray-500 text-sm font-medium mb-6">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
