"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { apiGet } from "@/lib/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ParentalGate from "@/components/ui/ParentalGate";
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
  abc_puzzles: "abc_puzzles",
  cooking: "cooking",
};

const PROGRESS_COLORS = [
  "from-pink-400 to-rose-500",
  "from-sky-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-amber-300 to-yellow-500",
  "from-orange-400 to-orange-500",
  "from-emerald-400 to-green-500",
  "from-teal-400 to-cyan-500",
  "from-indigo-400 to-indigo-500",
  "from-rose-400 to-pink-500",
  "from-fuchsia-400 to-purple-500",
  "from-red-400 to-orange-500",
];

export default function DashboardPage() {
  const { t } = useTranslation("ui");
  const { t: tAct } = useTranslation("activities");
  const router = useRouter();
  const { children, activeChild, loading: profileLoading } = useChildProfile();
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [gateUnlocked, setGateUnlocked] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-playful">
        <LoadingSpinner size="lg" />
      </div>
    );
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            ←
          </Button>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {t("dashboard")}
          </h1>
        </div>

        {children.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all min-h-[44px] ${
                  selectedChildId === child.id
                    ? "bg-gradient-to-b from-indigo-400 to-indigo-500 text-white shadow-md shadow-indigo-500/30"
                    : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
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
            <div className="grid grid-cols-2 gap-4">
              <Card padding="md" className="bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200">
                <p className="text-sm text-amber-600 font-bold">{t("bananas")}</p>
                <p className="text-3xl font-extrabold text-amber-700 mt-1">🍌 {data.child.bananas}</p>
              </Card>
              <Card padding="md" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200">
                <p className="text-sm text-indigo-600 font-bold">{t("session_time")}</p>
                <p className="text-3xl font-extrabold text-indigo-700 mt-1">
                  {data.time_spent.today_minutes} <span className="text-lg">{t("minutes")}</span>
                </p>
                <p className="text-xs text-indigo-400 font-semibold mt-1">
                  {data.time_spent.week_minutes} {t("minutes")} / week
                </p>
              </Card>
            </div>

            <Card padding="md">
              <h2 className="font-extrabold text-gray-800 mb-4">{tAct("progress")}</h2>
              <div className="space-y-3">
                {(Object.entries(MODULE_LABELS) as [ModuleType, string][]).map(
                  ([key, label], i) => {
                    const mod = data.progress_summary[key];
                    if (!mod) return null;
                    const pct =
                      mod.total > 0
                        ? Math.round((mod.completed / mod.total) * 100)
                        : 0;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-sm w-28 text-gray-600 font-semibold">
                          {tAct(label)}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                          <div
                            className={`bg-gradient-to-r ${PROGRESS_COLORS[i]} h-3 rounded-full transition-all shadow-sm`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-bold w-12 text-right">
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
                <h2 className="font-extrabold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-2">
                  {data.recent_activity.slice(0, 10).map((act, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm py-1"
                    >
                      <span className="text-gray-600 font-medium">
                        {tAct(act.module_type)} — {act.item_identifier}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                          act.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {act.status === "completed" ? "⭐" : "🔄"} {act.status}
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
