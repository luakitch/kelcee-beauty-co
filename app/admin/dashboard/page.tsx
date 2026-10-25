import type { Metadata } from "next";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminDashboardTabs } from "@/components/admin/AdminDashboardTabs";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Site Admin",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <AdminAuthGate>
      <AdminShell title="Site Admin">
        <AdminDashboardTabs />
      </AdminShell>
    </AdminAuthGate>
  );
}
