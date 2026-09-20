import type { Metadata } from "next";
import { BookButton } from "@/components/BookButton";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { services, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description: `Explore hair services at ${siteConfig.name} — cuts, color, styling, and more.`,
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Services"
        description="Every service is customized to your hair, your vibe, and your lifestyle. Prices are starting points — final pricing depends on hair length and complexity."
      />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.name} {...service} />
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-blush-200 bg-blush-50/50 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-charcoal">
            Ready to book?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-charcoal/70">
            Message us on Instagram with the service you&apos;re interested in
            and we&apos;ll get you scheduled.
          </p>
          <div className="mt-6">
            <BookButton />
          </div>
        </div>
      </section>
    </>
  );
}
