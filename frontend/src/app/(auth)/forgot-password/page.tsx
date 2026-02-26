"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const { t } = useTranslation("ui");
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await forgotPassword(email);
    setSent(true);
    setLoading(false);
  }

  return (
    <Card padding="lg">
      <h1 className="text-xl font-bold text-center mb-4">
        {t("forgot_password")}
      </h1>

      {sent ? (
        <div className="text-center">
          <div className="bg-emerald-50 text-emerald-600 rounded-xl px-4 py-3 text-sm mb-4">
            Check your email for a reset link.
          </div>
          <Link href="/login" className="text-emerald-600 hover:underline">
            {t("login")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" loading={loading} className="w-full">
            {t("send_reset_link")}
          </Button>
        </form>
      )}
    </Card>
  );
}
