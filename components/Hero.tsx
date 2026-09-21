import Link from "next/link";
import { BookButton } from "@/components/BookButton";
import { BowAccent } from "@/components/BowAccent";
import { BrandLogo } from "@/components/BrandLogo";
import { siteConfig } from "@/lib/site-config";

const heroBows = [
  {
    size: 56,
    className: "absolute left-[4%] top-8 text-blush-200",
    delay: -1.2,
    duration: 11,
    peak: 0.5,
  },
  {
    size: 36,
    className: "absolute left-[12%] top-28 text-blush-300 hidden sm:block",
    delay: -4.5,
    duration: 9,
    peak: 0.4,
  },
  {
    size: 28,
    className: "absolute left-[6%] bottom-20 text-blush-200 hidden md:block",
    delay: -7.2,
    duration: 12,
    peak: 0.35,
  },
  {
    size: 48,
    className: "absolute right-[5%] top-12 text-blush-300",
    delay: -2.8,
    duration: 10,
    peak: 0.45,
  },
  {
    size: 32,
    className: "absolute right-[14%] top-32 text-blush-200 hidden sm:block",
    delay: -6.1,
    duration: 13,
    peak: 0.38,
  },
  {
    size: 44,
    className: "absolute right-[8%] bottom-16 text-blush-300",
    delay: -8.4,
    duration: 11,
    peak: 0.42,
  },
  {
    size: 24,
    className: "absolute left-[22%] top-16 text-blush-200 hidden lg:block",
    delay: -3.6,
    duration: 9,
    peak: 0.32,
  },
  {
    size: 30,
    className: "absolute right-[22%] bottom-24 text-blush-200 hidden lg:block",
    delay: -9.8,
    duration: 12,
    peak: 0.34,
  },
  {
    size: 26,
    className: "absolute left-1/2 top-10 -translate-x-1/2 text-blush-300 hidden md:block",
    delay: -5.4,
    duration: 10,
    peak: 0.28,
  },
  {
    size: 34,
    className: "absolute bottom-10 left-[30%] text-blush-300 hidden sm:block",
    delay: -0.8,
    duration: 14,
    peak: 0.36,
  },
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blush-100 via-cream to-cream px-4 py-20 sm:px-6 sm:py-28">
      {heroBows.map((bow, index) => (
        <BowAccent
          key={index}
          animated
          size={bow.size}
          className={bow.className}
          delay={bow.delay}
          duration={bow.duration}
          peak={bow.peak}
        />
      ))}

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-6 flex justify-center">
          <BrandLogo size="hero" showName={false} />
        </div>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blush-500">
          {siteConfig.location}
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl md:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-charcoal/75">
          {siteConfig.description}
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
