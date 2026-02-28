"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const { t } = useTranslation("ui");
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/profiles");
    }
  }, [authLoading, user, router]);

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
    <Card padding="lg" className="animate-slide-up">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🦍</div>
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          {t("app_name")}
        </h1>
      </div>
      <h2 className="text-lg font-bold text-center mb-4 text-gray-700">
        {t("login")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 rounded-2xl px-4 py-3 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
            {t("email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
            {t("password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
            required
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          {t("login")}
        </Button>
      </form>

      <div className="flex justify-between text-sm mt-4">
        <Link
          href="/forgot-password"
          className="text-indigo-500 font-semibold hover:underline"
        >
          {t("forgot_password")}
        </Link>
        <Link href="/register" className="text-indigo-500 font-semibold hover:underline">
          {t("register")}
        </Link>
      </div>
    </Card>
  );
}
