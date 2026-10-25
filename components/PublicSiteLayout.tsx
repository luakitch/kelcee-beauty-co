"use client";

import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SalesTopBanner } from "@/components/SalesTopBanner";
import { useSaleServicesContext } from "@/components/SaleServicesProvider";

type PublicSiteLayoutProps = {
  children: ReactNode;
};

export function PublicSiteLayout({ children }: PublicSiteLayoutProps) {
  const { loaded, hasSales } = useSaleServicesContext();
  const showSaleBanner = loaded && hasSales;

  return (
    <>
      <SalesTopBanner />
      <Header
        stickyClassName={
          showSaleBanner ? "sticky top-9 z-50" : "sticky top-0 z-50"
        }
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
