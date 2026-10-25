"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  getAdminAccess,
  onAuthStateChange,
  withTimeout,
} from "@/lib/supabase/auth";

type AdminAuthGateProps = {
  children: React.ReactNode;
};

const SESSION_CHECK_MS = 8000;

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifyAccess() {
      const access = await withTimeout(
        getAdminAccess(),
        SESSION_CHECK_MS,
        () => null,
      );

      if (cancelled) return;

      if (!access) {
        setSession(null);
        setLoading(false);
        setDenied(true);
        router.replace("/admin");
        return;
      }

      setSession(access.session);
      setLoading(false);
      setDenied(false);
    }

    verifyAccess();

    const unsubscribe = onAuthStateChange(async () => {
      const access = await getAdminAccess();
      if (cancelled) return;

      if (!access) {
        setSession(null);
        setLoading(false);
        setDenied(true);
        router.replace("/admin");
        return;
      }

      setSession(access.session);
      setLoading(false);
      setDenied(false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream">
        <div className="h-10 w-10 animate-pulse rounded-full bg-blush-200" />
        <p className="text-sm text-charcoal/60">Loading admin…</p>
      </div>
    );
  }

  if (denied || !session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-4">
        <p className="text-sm text-charcoal/70">Sign in to continue.</p>
        <Link
          href="/admin"
          className="rounded-full bg-blush-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blush-600"
        >
          Go to admin login
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
