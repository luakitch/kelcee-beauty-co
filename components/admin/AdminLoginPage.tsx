"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import {
  getAdminAccess,
  isAdminUser,
  onAuthStateChange,
  withTimeout,
} from "@/lib/supabase/auth";

const SESSION_CHECK_MS = 8000;

export function AdminLoginPage() {
  const router = useRouter();
  const redirectingRef = useRef(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [checkNote, setCheckNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    function goToDashboard() {
      if (redirectingRef.current) return;
      redirectingRef.current = true;
      router.replace("/admin/dashboard");
    }

    async function finishCheck() {
      const access = await withTimeout(
        getAdminAccess(),
        SESSION_CHECK_MS,
        () => null,
      );

      if (cancelled) return;

      if (access) {
        goToDashboard();
        return;
      }

      setCheckNote(null);
      setCheckingSession(false);
      redirectingRef.current = false;
    }

    finishCheck();

    const unsubscribe = onAuthStateChange((session) => {
      if (cancelled) return;

      if (session && isAdminUser(session.user)) {
        goToDashboard();
        return;
      }

      setCheckingSession(false);
      redirectingRef.current = false;
    });

    const slowTimer = window.setTimeout(() => {
      if (!cancelled) {
        setCheckNote("Still checking your session…");
      }
    }, 2500);

    return () => {
      cancelled = true;
      window.clearTimeout(slowTimer);
      unsubscribe();
    };
  }, [router]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream">
        <div className="h-10 w-10 animate-pulse rounded-full bg-blush-200" />
        {checkNote && (
          <p className="text-sm text-charcoal/60">{checkNote}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blush-50 via-cream to-cream px-4 py-12">
      <AdminLoginForm />
    </div>
  );
}
