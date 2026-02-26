"use client";

import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";

interface ArtworkViewerProps {
  fileUrl: string;
  activityType: string;
  createdAt: string;
  onDelete: () => void;
  onBack: () => void;
  deleting?: boolean;
}

export default function ArtworkViewer({
  fileUrl,
  activityType,
  createdAt,
  onDelete,
  onBack,
  deleting,
}: ArtworkViewerProps) {
  const { t } = useTranslation("ui");

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Button size="sm" variant="ghost" onClick={onBack}>
          ← {t("back")}
        </Button>
        <span className="text-sm text-zinc-500">
          {activityType} — {new Date(createdAt).toLocaleDateString()}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="text-red-500"
          loading={deleting}
          onClick={onDelete}
        >
          {t("delete")}
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <img
          src={fileUrl}
          alt={activityType}
          className="max-w-full max-h-full object-contain rounded-xl"
        />
      </div>
    </div>
  );
}
