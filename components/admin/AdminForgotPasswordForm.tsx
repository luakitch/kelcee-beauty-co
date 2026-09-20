"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { requestPasswordReset } from "@/lib/supabase/auth";

type AdminForgotPasswordFormProps = {
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
};

export function AdminForgotPasswordForm({
  backHref = "/admin",
  backLabel = "← Back to sign in",
  onBack,
}: AdminForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSent(true);
  }

  function BackControl({ className }: { className: string }) {
    if (onBack) {
      return (
        <button type="button" onClick={onBack} className={className}>
          {backLabel}
        </button>
      );
    }

    return (
      <Link href={backHref} className={className}>
        {backLabel}
      </Link>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex justify-center">
        <BrandLogo size="lg" showName={false} />
      </div>

      <div className="rounded-2xl border border-blush-200 bg-white/80 p-8 shadow-sm backdrop-blur-sm">
        <h1 className="font-display text-3xl font-semibold text-charcoal">
          Reset password
        </h1>

        {sent ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm leading-relaxed text-charcoal/70">
              If an admin account exists for{" "}
              <span className="font-medium text-charcoal">{email.trim()}</span>
              , a reset link is on its way. Open the email and follow the link to
              choose a new password.
            </p>
            <p className="text-xs text-charcoal/50">
              The link goes to the admin set-password page. Check spam if you
              don&apos;t see it within a few minutes.
            </p>
            <BackControl className="flex w-full items-center justify-center rounded-full border border-blush-300 px-6 py-3 text-sm font-medium text-charcoal transition hover:bg-blush-50" />
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-charcoal/70">
              Enter your admin email and we&apos;ll send a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-2 block text-sm font-medium text-charcoal"
                >
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-blush-200 bg-white px-4 py-3 text-charcoal outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-200"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-charcoal">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-blush-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blush-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>

            <BackControl className="mt-6 block w-full text-center text-sm font-medium text-blush-600 transition hover:text-blush-700" />
          </>
        )}
      </div>
    </div>
  );
}
