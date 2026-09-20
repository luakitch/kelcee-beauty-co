import { BowAccent } from "@/components/BowAccent";
import { BrandLogo } from "@/components/BrandLogo";
import { siteConfig } from "@/lib/site-config";

export function UnderConstructionPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blush-100 via-cream to-cream px-4 py-16">
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

      <div className="relative mx-auto max-w-lg text-center">
        <BrandLogo size="hero" showName={false} className="justify-center" />

        <p className="mb-4 mt-8 text-sm font-medium uppercase tracking-[0.2em] text-blush-500">
          Coming soon
        </p>

        <h1 className="font-display text-4xl font-semibold text-charcoal sm:text-5xl">
          Something beautiful is on the way
        </h1>

        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-charcoal/75">
          {siteConfig.name} is getting a fresh new home. Check back soon for
          soft color, sweet styles, and salon magic.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-blush-500 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-blush-600 hover:shadow-lg"
          >
            Follow on Instagram
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center justify-center rounded-full border-2 border-blush-300 bg-white/60 px-8 py-3.5 text-sm font-medium text-blush-600 transition hover:border-blush-400 hover:bg-white"
          >
            Get in touch
          </a>
        </div>

        <p className="mt-12 text-sm text-charcoal/50">{siteConfig.location}</p>
      </div>
    </div>
  );
}
