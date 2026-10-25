"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSaleServices } from "@/components/useSaleServices";
import type { CatalogService } from "@/lib/catalog-service";

type SaleServicesContextValue = {
  saleServices: CatalogService[];
  loaded: boolean;
  hasSales: boolean;
};

const SaleServicesContext = createContext<SaleServicesContextValue | null>(
  null,
);

export function SaleServicesProvider({ children }: { children: ReactNode }) {
  const value = useSaleServices();
  return (
    <SaleServicesContext.Provider value={value}>
      {children}
    </SaleServicesContext.Provider>
  );
}

export function useSaleServicesContext(): SaleServicesContextValue {
  const context = useContext(SaleServicesContext);
  if (!context) {
    throw new Error(
      "useSaleServicesContext must be used within SaleServicesProvider",
    );
  }
  return context;
}

/** Safe when provider is optional (returns empty state). */