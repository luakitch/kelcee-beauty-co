import type { Metadata } from "next";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminGalleryManager } from "@/components/admin/AdminGalleryManager";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Gallery Admin",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <AdminAuthGate>
      <AdminShell title="Gallery Admin">
        <AdminGalleryManager />
      </AdminShell>
    </AdminAuthGate>
  );
}
