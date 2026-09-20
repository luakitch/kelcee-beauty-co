import type { Metadata } from "next";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminChangePasswordForm } from "@/components/admin/AdminChangePasswordForm";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Change Admin Password",
  robots: { index: false, follow: false },
};

export default function AdminChangePasswordPage() {
  return (
    <AdminAuthGate>
      <AdminShell title="Change password">
        <AdminChangePasswordForm />
      </AdminShell>
    </AdminAuthGate>
  );
}
