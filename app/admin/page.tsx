import type { Metadata } from "next";
import { AdminLoginPage } from "@/components/admin/AdminLoginPage";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminLoginPage />;
}
