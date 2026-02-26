"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { apiGet } from "@/lib/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { DashboardData, ModuleType } from "@/types";

const MODULE_LABELS: Record<ModuleType, string> = {
  letter_tracing: "letter_tracing",
  number_tracing: "number_tracing",
  matching: "matching",
  coloring: "coloring",
  free_drawing: "free_drawing",
  memory_cards: "memory_cards",
  puzzles: "puzzles",
  fill_the_gaps: "fill_the_gaps",
  sorting: "sorting",
};

export default function DashboardPage() {
  const { t } = useTranslation("ui");
  const { t: tAct } = useTranslation("activities");
  const router = useRouter();
  const { children, activeChild, loading: profileLoading } = useChildProfile();
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profileLoading && activeChild) {
      setSelectedChildId(activeChild.id);
    }
  }, [profileLoading, activeChild]);

  useEffect(() => {
    if (!selectedChildId) return;
    setLoading(true);
    apiGet<DashboardData>(`/api/children/${selectedChildId}/dashboard`).then(
      (res) => {
        if (res.success) setData(res.data);
        setLoading(false);
      }
    );
  }, [selectedChildId]);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            ← {t("back")}
          </Button>
          <h1 className="text-xl font-bold">{t("dashboard")}</h1>
        </div>

        {children.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
                  selectedChildId === child.id
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        )}

        {loading || !data ? (
          <LoadingSpinner className="py-20" />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card padding="md">
                <p className="text-sm text-zinc-500">{t("bananas")}</p>
                <p className="text-2xl font-bold">🍌 {data.child.bananas}</p>
              </Card>
              <Card padding="md">
                <p className="text-sm text-zinc-500">{t("session_time")}</p>
                <p className="text-2xl font-bold">
                  {data.time_spent.today_minutes} {t("minutes")}
                </p>
                <p className="text-xs text-zinc-400">
                  {data.time_spent.week_minutes} {t("minutes")} / week
                </p>
              </Card>
            </div>

            <Card padding="md">
              <h2 className="font-semibold mb-3">{tAct("progress")}</h2>
              <div className="space-y-2">
                {(Object.entries(MODULE_LABELS) as [ModuleType, string][]).map(
                  ([key, label]) => {
                    const mod = data.progress_summary[key];
                    if (!mod) return null;
                    const pct =
                      mod.total > 0
                        ? Math.round((mod.completed / mod.total) * 100)
                        : 0;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-sm w-28 text-zinc-600">
                          {tAct(label)}
                        </span>
                        <div className="flex-1 bg-zinc-100 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-400 w-12 text-right">
                          {mod.completed}/{mod.total}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </Card>

            {data.recent_activity.length > 0 && (
              <Card padding="md">
                <h2 className="font-semibold mb-3">Recent Activity</h2>
                <div className="space-y-2">
                  {data.recent_activity.slice(0, 10).map((act, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-zinc-600">
                        {tAct(act.module_type)} — {act.item_identifier}
                      </span>
                      <span
                        className={
                          act.status === "completed"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }
                      >
                        {act.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
