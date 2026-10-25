"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CatalogService } from "@/lib/catalog-service";
import { loadCatalogServicesForAdmin } from "@/lib/supabase/catalog-services-admin";

type AdminCatalogServicesContextValue = {
  savedServices: CatalogService[];
  refreshSavedServices: () => Promise<void>;
  refreshing: boolean;
};

const AdminCatalogServicesContext =
  createContext<AdminCatalogServicesContextValue | null>(null);

export function AdminCatalogServicesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [savedServices, setSavedServices] = useState<CatalogService[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refreshSavedServices = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await loadCatalogServicesForAdmin();
      setSavedServices(data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshSavedServices();
  }, [refreshSavedServices]);

  const value = useMemo(
    () => ({
      savedServices,
      refreshSavedServices,
      refreshing,
    }),
    [savedServices, refreshSavedServices, refreshing],
  );

  return (
    <AdminCatalogServicesContext.Provider value={value}>
      {children}
    </AdminCatalogServicesContext.Provider>
  );
}

export function useAdminCatalogServices() {
  const context = useContext(AdminCatalogServicesContext);
  if (!context) {
    throw new Error(
      "useAdminCatalogServices must be used within AdminCatalogServicesProvider",
    );
  }
  return context;
}
