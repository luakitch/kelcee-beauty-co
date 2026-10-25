"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BowDivider } from "@/components/BowAccent";
import { ServiceCard } from "@/components/ServiceCard";
import {
  catalogServiceToCardProps,
  getDefaultCatalogServices,
  getFeaturedCatalogServices,
  type CatalogService,
} from "@/lib/catalog-service";
import { fetchCatalogServices } from "@/lib/supabase/catalog-services";

export function FeaturedServicesSection() {
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

  const featured = getFeaturedCatalogServices(services).slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
          Our Services
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
          Cuts, color, styling, lashes, brows, and more — see full pricing on
          our services page.
        </p>
        <BowDivider className="mt-6" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((service) => (
          <ServiceCard
            key={service.name}
            {...catalogServiceToCardProps(service)}
          />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/services"
          className="text-sm font-medium text-blush-600 transition hover:text-blush-700"
        >
          View all services →
        </Link>
      </div>
    </section>
  );
}
