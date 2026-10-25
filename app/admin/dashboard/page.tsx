import type { Metadata } from "next";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminGalleryManager } from "@/components/admin/AdminGalleryManager";
import { AdminHoursEditor } from "@/components/admin/AdminHoursEditor";
import { AdminServicesEditor } from "@/components/admin/AdminServicesEditor";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Site Admin",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <AdminAuthGate>
      <AdminShell title="Site Admin">
        <div className="space-y-10">
          <AdminHoursEditor />
          <AdminServicesEditor />
          <AdminGalleryManager />
        </div>
      </AdminShell>
    </AdminAuthGate>
  );
}
