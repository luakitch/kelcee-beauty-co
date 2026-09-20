import Link from "next/link";
import { BookButton } from "@/components/BookButton";
import { BowAccent } from "@/components/BowAccent";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blush-100 via-cream to-cream px-4 py-20 sm:px-6 sm:py-28">
      <BowAccent
        size={64}
        className="absolute left-8 top-12 text-blush-200 opacity-60"
      />
      <BowAccent
        size={40}
        className="absolute right-12 top-24 text-blush-300 opacity-50"
      />
      <BowAccent
        size={32}
        className="absolute bottom-16 left-1/4 text-blush-200 opacity-40"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blush-500">
          Welcome, beautiful
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl md:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-charcoal/75">
          {siteConfig.tagline} Soft pastels, pretty details, and hair that feels
          as good as it looks.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <BookButton size="lg" />
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full border-2 border-blush-300 bg-white/60 px-9 py-4 text-lg font-medium text-blush-600 transition hover:border-blush-400 hover:bg-white"
          >
            View Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
