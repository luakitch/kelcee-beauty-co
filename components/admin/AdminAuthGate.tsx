"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  getSession,
  isAdminUser,
  onAuthStateChange,
} from "@/lib/supabase/auth";

type AdminAuthGateProps = {
  children: React.ReactNode;
};

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getSession().then((currentSession) => {
      if (cancelled) return;

      if (!currentSession || !isAdminUser(currentSession.user)) {
        router.replace("/admin");
        return;
      }

      setSession(currentSession);
      setLoading(false);
    });

    const unsubscribe = onAuthStateChange((nextSession) => {
      if (!nextSession || !isAdminUser(nextSession.user)) {
        router.replace("/admin");
        return;
      }

      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [router]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-10 w-10 animate-pulse rounded-full bg-blush-200" />
      </div>
    );
  }

  return <>{children}</>;
}
