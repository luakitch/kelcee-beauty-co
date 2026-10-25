"use client";

import { useEffect, useState } from "react";
import { BowDivider } from "@/components/BowAccent";
import { ServiceCard } from "@/components/ServiceCard";
import {
  catalogServiceToCardProps,
  getDefaultCatalogServices,
  getSaleServices,
  type CatalogService,
} from "@/lib/catalog-service";
import { fetchCatalogServices } from "@/lib/supabase/catalog-services";

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

  if (loaded && saleServices.length === 0) {
    return null;
  }

  if (!loaded && getSaleServices(services).length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className={`scroll-mt-24 bg-gradient-to-b from-rose-50/80 to-blush-50/40 px-4 py-16 sm:px-6 sm:py-20 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        {showHeader && (
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
              Limited time
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Current Sales
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
              Book these services at special pricing while the sale is on.
            </p>
            <BowDivider className="mt-6" />
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saleServices.map((service) => (
            <ServiceCard
              key={service.name}
              {...catalogServiceToCardProps(service)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
