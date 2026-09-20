"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { signInWithPassword } from "@/lib/supabase/auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signInWithPassword(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace("/admin/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex justify-center">
        <BrandLogo size="lg" showName={false} />
      </div>

      <div className="rounded-2xl border border-blush-200 bg-white/80 p-8 shadow-sm backdrop-blur-sm">
        <h1 className="font-display text-3xl font-semibold text-charcoal">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-charcoal/70">
          Sign in to manage gallery photos.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-charcoal"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-blush-200 bg-white px-4 py-3 text-charcoal outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-200"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-charcoal"
              >
                Password
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-xs font-medium text-blush-600 transition hover:text-blush-700"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
