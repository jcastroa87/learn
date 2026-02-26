"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";

export default function ActivityLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation("ui");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-zinc-100">
        <Button variant="ghost" size="sm" onClick={() => router.push("/menu")}>
          ← {t("home")}
        </Button>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
