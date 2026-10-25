"use client";

import { usePathname } from "next/navigation";
import { PublicSiteLayout } from "@/components/PublicSiteLayout";
import { SaleServicesProvider } from "@/components/SaleServicesProvider";
import { SiteAccessGate } from "@/components/SiteAccessGate";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SiteAccessGate>
      <SaleServicesProvider>
        <PublicSiteLayout>{children}</PublicSiteLayout>
      </SaleServicesProvider>
    </SiteAccessGate>
  );
}
