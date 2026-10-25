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
import type { ServiceCategory } from "@/lib/site-config";
import {
  loadCatalogServicesForAdmin,
  type ServiceDraft,
} from "@/lib/supabase/catalog-services-admin";

function serviceDraftToCatalog(draft: ServiceDraft): CatalogService {
  const idFromKey =
    draft.isNew || draft.clientKey.startsWith("name:")
      ? null
      : draft.clientKey;

  return {
    id: idFromKey,
    name: draft.name.trim(),
    description: draft.description.trim(),
    priceText: draft.priceText.trim(),
    duration: draft.duration.trim(),
    category: draft.category as ServiceCategory,
    sortOrder: draft.sortOrder,
    isOnSale: draft.isOnSale,
    salePriceText: draft.isOnSale ? draft.salePriceText.trim() || null : null,
  };
}

type AdminCatalogServicesContextValue = {
  catalogForPromo: CatalogService[];
  refreshSavedServices: () => Promise<void>;
  setServiceDrafts: (drafts: ServiceDraft[] | null) => void;
  refreshing: boolean;
  hasLiveDrafts: boolean;
};

const AdminCatalogServicesContext =
  createContext<AdminCatalogServicesContextValue | null>(null);

export function AdminCatalogServicesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [savedServices, setSavedServices] = useState<CatalogService[]>([]);
  const [serviceDrafts, setServiceDrafts] = useState<ServiceDraft[] | null>(
    null,
  );
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

  const catalogForPromo = useMemo(() => {
    if (serviceDrafts) {
      return serviceDrafts.map(serviceDraftToCatalog);
    }
    return savedServices;
  }, [serviceDrafts, savedServices]);

  useEffect(() => {
    void refreshSavedServices();
  }, [refreshSavedServices]);

  const value = useMemo(
    () => ({
      catalogForPromo,
      refreshSavedServices,
      setServiceDrafts,
      refreshing,
      hasLiveDrafts: serviceDrafts !== null,
    }),
    [
      catalogForPromo,
      refreshSavedServices,
      refreshing,
      serviceDrafts,
    ],
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
