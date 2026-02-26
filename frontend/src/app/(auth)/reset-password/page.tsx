"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

function ResetPasswordForm() {
  const { t } = useTranslation("ui");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [email] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await resetPassword(token, email, password, passwordConfirmation);

    if (res.success) {
      router.push("/login");
    } else {
      setError(res.error || "Failed to reset password");
    }
    setLoading(false);
  }

  return (
    <Card padding="lg">
      <h1 className="text-xl font-bold text-center mb-4">
        {t("reset_password")}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

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
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            {t("confirm_password")}
          </label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          {t("reset_password")}
        </Button>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
