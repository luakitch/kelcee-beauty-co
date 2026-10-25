"use client";

import { usePathname } from "next/navigation";
import { PublicSiteLayout } from "@/components/PublicSiteLayout";
import { SaleServicesProvider } from "@/components/SaleServicesProvider";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SaleServicesProvider>
      <PublicSiteLayout>{children}</PublicSiteLayout>
    </SaleServicesProvider>
  );
}
