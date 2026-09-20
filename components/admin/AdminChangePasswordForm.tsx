"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSession,
  requestPasswordReset,
  setPassword,
} from "@/lib/supabase/auth";

export function AdminChangePasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailResetLoading, setEmailResetLoading] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      setEmail(session?.user.email ?? null);
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

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

    setPasswordValue("");
    setConfirmPassword("");
    setSuccess("Password updated.");
  }

  async function handleEmailReset() {
    if (!email) return;

    setError(null);
    setSuccess(null);
    setEmailResetLoading(true);

    const result = await requestPasswordReset(email);
    setEmailResetLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(`Reset link sent to ${email}. Check your inbox.`);
  }

  return (
    <div className="max-w-lg">
      <p className="text-sm text-charcoal/70">
        Choose a new password below, or have a reset link emailed to you.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="new-password"
            className="mb-2 block text-sm font-medium text-charcoal"
          >
            New password
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
            Confirm new password
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

        {success && (
          <p className="rounded-xl bg-blush-50 px-4 py-3 text-sm text-charcoal">
            {success}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-blush-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blush-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save new password"}
          </button>
          <button
            type="button"
            onClick={() => router.replace("/admin/dashboard")}
            className="rounded-full border border-blush-300 px-6 py-3 text-sm font-medium text-charcoal transition hover:bg-blush-50"
          >
            Back to gallery
          </button>
        </div>
      </form>

      {email && (
        <div className="mt-10 border-t border-blush-200 pt-8">
          <p className="text-sm font-medium text-charcoal">
            Prefer email instead?
          </p>
          <p className="mt-1 text-sm text-charcoal/70">
            We&apos;ll send a reset link to{" "}
            <span className="font-medium text-charcoal">{email}</span>.
          </p>
          <button
            type="button"
            onClick={handleEmailReset}
            disabled={emailResetLoading}
            className="mt-4 text-sm font-medium text-blush-600 transition hover:text-blush-700 disabled:opacity-60"
          >
            {emailResetLoading ? "Sending..." : "Email me a reset link"}
          </button>
        </div>
      )}
    </div>
  );
}
