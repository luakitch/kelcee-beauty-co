import type { Metadata } from "next";
import { BookButton } from "@/components/BookButton";
import { BowDivider } from "@/components/BowAccent";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import {
  getServicesByCategory,
  serviceCategories,
  siteConfig,
} from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description: `Services and pricing at ${siteConfig.name} in ${siteConfig.location}.`,
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Services & Pricing"
        description="All services and prices match our Square booking page. Final pricing may vary by hair length and complexity."
      />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="space-y-16">
          {serviceCategories.map((category) => {
            const categoryServices = getServicesByCategory(category);
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
                    <ServiceCard key={service.name} {...service} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl border border-blush-200 bg-blush-50/50 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-charcoal">
            Ready to book?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-charcoal/70">
            Pick your service and schedule online — it only takes a few minutes.
          </p>
          <div className="mt-6">
            <BookButton />
          </div>
        </div>
      </section>
    </>
  );
}
