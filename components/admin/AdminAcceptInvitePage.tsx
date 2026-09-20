"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { AdminSetPasswordForm } from "@/components/admin/AdminSetPasswordForm";
import {
  getSession,
  isAdminUser,
  isInviteOrRecoveryLink,
  isRecoveryLink,
  onAuthStateChange,
} from "@/lib/supabase/auth";

export function AdminAcceptInvitePage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (!isInviteOrRecoveryLink()) {
      router.replace("/admin");
      return;
    }

    setIsRecovery(isRecoveryLink());

    let cancelled = false;

    function handleSession(session: Session | null) {
      if (session && isAdminUser(session.user)) {
        setNeedsPassword(true);
        setCheckingSession(false);
        return;
      }

      if (session && !isAdminUser(session.user)) {
        router.replace("/admin");
      }
    }

    async function bootstrap() {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const session = await getSession();
        if (cancelled) return;

        if (session) {
          handleSession(session);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      if (!cancelled) {
        setCheckingSession(false);
      }
    }

    bootstrap();
    const unsubscribe = onAuthStateChange((session) => handleSession(session));

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [router]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-10 w-10 animate-pulse rounded-full bg-blush-200" />
      </div>
    );
  }

  if (!needsPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blush-50 via-cream to-cream px-4 py-12">
        <div className="max-w-md rounded-2xl border border-blush-200 bg-white/80 p-8 text-center shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-charcoal">
            Invite link expired or invalid
          </h1>
          <p className="mt-3 text-sm text-charcoal/70">
            Ask for a new admin invitation, or sign in if you already set your
            password.
          </p>
          <a
            href="/admin"
            className="mt-6 inline-flex rounded-full bg-blush-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blush-600"
          >
            Go to admin login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blush-50 via-cream to-cream px-4 py-12">
      <AdminSetPasswordForm
        title={isRecovery ? "Set a new password" : "Create your password"}
        description={
          isRecovery
            ? "Choose a new password for your Kelcee Beauty Co. admin account."
            : "Set a password to finish activating your Kelcee Beauty Co. admin account."
        }
      />
    </div>
  );
}
