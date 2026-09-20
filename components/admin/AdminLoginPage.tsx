"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { AdminForgotPasswordForm } from "@/components/admin/AdminForgotPasswordForm";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import {
  getSession,
  isAdminUser,
  onAuthStateChange,
} from "@/lib/supabase/auth";

export function AdminLoginPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    function handleSession(session: Session | null) {
      if (session && isAdminUser(session.user)) {
        router.replace("/admin/dashboard");
        return;
      }
      setCheckingSession(false);
    }

    getSession().then(handleSession);
    const unsubscribe = onAuthStateChange(handleSession);
    return unsubscribe;
  }, [router]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-10 w-10 animate-pulse rounded-full bg-blush-200" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blush-50 via-cream to-cream px-4 py-12">
      {showForgotPassword ? (
        <AdminForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
      ) : (
        <AdminLoginForm
          onForgotPassword={() => setShowForgotPassword(true)}
        />
      )}
    </div>
  );
}
