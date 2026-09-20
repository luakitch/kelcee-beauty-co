import type { Metadata } from "next";
import { AdminAcceptInvitePage } from "@/components/admin/AdminAcceptInvitePage";

export const metadata: Metadata = {
  title: "Accept Admin Invite",
  robots: { index: false, follow: false },
};

export default function AdminAcceptInviteRoute() {
  return <AdminAcceptInvitePage />;
}
