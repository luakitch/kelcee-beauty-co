"use client";

import { useEffect, useState } from "react";
import { BowDivider } from "@/components/BowAccent";
import { ServiceCard } from "@/components/ServiceCard";
import {
  catalogServiceToCardProps,
  getDefaultCatalogServices,
  getOrderedCategoriesFromServices,
  getServicesByCategoryFromCatalog,
  type CatalogService,
} from "@/lib/catalog-service";
import { fetchCatalogServices } from "@/lib/supabase/catalog-services";

export function ServicesCatalog() {
  const [services, setServices] = useState<CatalogService[]>(
    getDefaultCatalogServices(),
  );

  useEffect(() => {
    let cancelled = false;

    fetchCatalogServices().then((data) => {
      if (!cancelled) {
        setServices(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-16">
        {getOrderedCategoriesFromServices(services).map((category) => {
          const categoryServices = getServicesByCategoryFromCatalog(
            services,
            category,
          );
          if (categoryServices.length === 0) return null;

          return (
            <div key={category}>
              <div className="mb-8 text-center">
                <h2 className="font-display text-2xl font-semibold text-charcoal sm:text-3xl">
                  {category}
                </h2>
                <BowDivider className="mt-4" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoryServices.map((service) => (
                  <ServiceCard
                    key={service.name}
                    {...catalogServiceToCardProps(service)}
                  />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}
