"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function VerifyEmailPage() {
  const { t } = useTranslation("ui");
  const { resendVerification } = useAuth();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    setLoading(true);
    await resendVerification();
    setSent(true);
    setLoading(false);
  }

  return (
    <Card padding="lg">
      <div className="text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-xl font-bold mb-2">{t("verify_email")}</h1>
        <p className="text-zinc-500 mb-6">{t("verify_email_message")}</p>

        {sent && (
          <div className="bg-emerald-50 text-emerald-600 rounded-xl px-4 py-3 text-sm mb-4">
            Verification email sent!
          </div>
        )}

        <Button onClick={handleResend} loading={loading} variant="secondary">
          {t("resend_verification")}
        </Button>
      </div>
    </Card>
  );
}
