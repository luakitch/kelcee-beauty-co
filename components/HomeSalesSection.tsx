"use client";

import { SalesSectionContent } from "@/components/SalesSectionContent";
import { useSaleServicesContext } from "@/components/SaleServicesProvider";

export function HomeSalesSection() {
  const { saleServices, loaded, hasSales } = useSaleServicesContext();

  if (!loaded && saleServices.length === 0) {
    return null;
  }

  if (loaded && !hasSales) {
    return null;
  }

  return <SalesSectionContent saleServices={saleServices} />;
}
