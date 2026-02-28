"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function RegisterPage() {
  const { t } = useTranslation("ui");
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const res = await register(email, password, passwordConfirmation);

    if (res.success) {
      router.push("/verify-email");
    } else if (res.data && "errors" in (res.data as unknown as Record<string, unknown>)) {
      setErrors((res.data as unknown as { errors: Record<string, string[]> }).errors);
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
        {t("register")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          {errors.email && (
            <p className="text-red-500 text-sm font-medium mt-1">{errors.email[0]}</p>
          )}
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
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm font-medium mt-1">{errors.password[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
            {t("confirm_password")}
          </label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
            required
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          {t("register")}
        </Button>
      </form>

      <p className="text-center text-sm mt-4">
        <Link href="/login" className="text-indigo-500 font-semibold hover:underline">
          {t("login")}
        </Link>
      </p>
    </Card>
  );
}
