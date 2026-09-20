import Link from "next/link";
import { BookButton } from "@/components/BookButton";
import { BowDivider } from "@/components/BowAccent";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/site-config";

export default function HomePage() {
  const featuredServices = services.slice(0, 3);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
            Our Services
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
            From soft balayage to special occasion styling — every service is
            tailored to you.
          </p>
          <BowDivider className="mt-6" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <ServiceCard key={service.name} {...service} />
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

      <section className="bg-blush-50/50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Recent Work
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
              A peek at the pretty pastels and soft styles coming out of the
              chair.
            </p>
            <BowDivider className="mt-6" />
          </div>

          <GalleryGrid limit={6} showCaptions={false} />

          <div className="mt-10 text-center">
            <Link
              href="/gallery"
              className="text-sm font-medium text-blush-600 transition hover:text-blush-700"
            >
              See full gallery →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
          Ready for Your Glow-Up?
        </h2>
        <p className="mt-4 text-lg text-charcoal/70">
          Send a DM on Instagram to book your appointment. Can&apos;t wait to
          meet you!
        </p>
        <div className="mt-8">
          <BookButton size="lg" />
        </div>
      </section>
    </>
  );
}
