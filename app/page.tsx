import Link from "next/link";
import { BookButton } from "@/components/BookButton";
import { BowDivider } from "@/components/BowAccent";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Hero } from "@/components/Hero";
import { HoursSection } from "@/components/HoursSection";
import { FeaturedServicesSection } from "@/components/FeaturedServicesSection";
import { SalesSection } from "@/components/SalesSection";

export default function HomePage() {
  return (
    <>
      <Hero />

      <SalesSection />

      <FeaturedServicesSection />

      <HoursSection />

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Recent Work
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
              Recent cuts, color, and styling from the chair.
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
          Ready to book?
        </h2>
        <p className="mt-4 text-lg text-charcoal/70">
          Schedule your appointment online in just a few clicks.
        </p>
        <div className="mt-8">
          <BookButton size="lg" />
        </div>
      </section>
    </>
  );
}
