"use client";

import { AdminForgotPasswordForm } from "@/components/admin/AdminForgotPasswordForm";

export function AdminForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blush-50 via-cream to-cream px-4 py-12">
      <AdminForgotPasswordForm
        backHref="/admin"
        backLabel="← Back to sign in"
      />
    </div>
  );
}
