"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const { t } = useTranslation("ui");
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);

    if (res.success) {
      router.push("/profiles");
    } else {
      setError(res.error || "Invalid email or password");
    }
    setLoading(false);
  }

  return (
    <Card padding="lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        {t("app_name")}
      </h1>
      <h2 className="text-lg font-semibold text-center mb-4">{t("login")}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            {t("email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            {t("password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          {t("login")}
        </Button>
      </form>

      <div className="flex justify-between text-sm text-zinc-500 mt-4">
        <Link
          href="/forgot-password"
          className="text-emerald-600 hover:underline"
        >
          {t("forgot_password")}
        </Link>
        <Link href="/register" className="text-emerald-600 hover:underline">
          {t("register")}
        </Link>
      </div>
    </Card>
  );
}
