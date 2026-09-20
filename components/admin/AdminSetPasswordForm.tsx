"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { clearAuthHashFromUrl, setPassword } from "@/lib/supabase/auth";

type AdminSetPasswordFormProps = {
  title?: string;
  description?: string;
};

export function AdminSetPasswordForm({
  title = "Create your password",
  description = "Set a password to finish activating your Kelcee Beauty Co. admin account.",
}: AdminSetPasswordFormProps) {
  const router = useRouter();
  const [password, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await setPassword(password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    clearAuthHashFromUrl();
    router.replace("/admin/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex justify-center">
        <BrandLogo size="lg" showName={false} />
      </div>

      <div className="rounded-2xl border border-blush-200 bg-white/80 p-8 shadow-sm backdrop-blur-sm">
        <h1 className="font-display text-3xl font-semibold text-charcoal">
          {title}
        </h1>
        <p className="mt-2 text-sm text-charcoal/70">{description}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-medium text-charcoal"
            >
              Password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPasswordValue(event.target.value)}
              className="w-full rounded-xl border border-blush-200 bg-white px-4 py-3 text-charcoal outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-200"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-medium text-charcoal"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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
            {loading ? "Saving..." : "Save password & continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
