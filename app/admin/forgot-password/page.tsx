import type { Metadata } from "next";
import { AdminForgotPasswordPage } from "@/components/admin/AdminForgotPasswordPage";

export const metadata: Metadata = {
  title: "Reset Admin Password",
  robots: { index: false, follow: false },
};

export default function AdminForgotPasswordRoute() {
  return <AdminForgotPasswordPage />;
}
