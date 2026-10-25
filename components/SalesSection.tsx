"use client";

import { SalesSectionContent } from "@/components/SalesSectionContent";
import { useSaleServices } from "@/components/useSaleServices";

type SalesSectionProps = {
  id?: string;
  className?: string;
  showHeader?: boolean;
};

export function SalesSection({
  id = "sales",
  className = "",
  showHeader = true,
}: SalesSectionProps) {
  const { saleServices, loaded, hasSales } = useSaleServices();

  if (!loaded && saleServices.length === 0) {
    return null;
  }

  if (loaded && !hasSales) {
    return null;
  }

  return (
    <SalesSectionContent
      saleServices={saleServices}
      id={id}
      className={className}
      showHeader={showHeader}
    />
  );
}
