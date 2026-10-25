"use client";

import { useEffect, useState } from "react";
import {
  getDefaultCatalogServices,
  getSaleServices,
  type CatalogService,
} from "@/lib/catalog-service";
import { fetchCatalogServices } from "@/lib/supabase/catalog-services";

export function useSaleServices() {
  const [services, setServices] = useState<CatalogService[]>(
    getDefaultCatalogServices(),
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchCatalogServices().then((data) => {
      if (!cancelled) {
        setServices(data);
        setLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const saleServices = getSaleServices(services);

  return {
    saleServices,
    loaded,
    hasSales: loaded && saleServices.length > 0,
  };
}
