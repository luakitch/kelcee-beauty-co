import { BookButton } from "@/components/BookButton";
import { BowDivider } from "@/components/BowAccent";
import { HoursGrid } from "@/components/HoursGrid";
import {
  getFullAddress,
  getMapsUrl,
  getPhoneHref,
  siteConfig,
} from "@/lib/site-config";

type HoursSectionProps = {
  id?: string;
  showHeader?: boolean;
  className?: string;
};

export function HoursSection({
  id = "hours",
  showHeader = true,
  className = "",
}: HoursSectionProps) {
  return (
    <section
      id={id}
      className={`bg-blush-50/50 px-4 py-16 sm:px-6 sm:py-20 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        {showHeader && (
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Our Hours
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
              Appointments available throughout the week — book online anytime.
            </p>
            <BowDivider className="mt-6" />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          <div className="rounded-2xl border border-blush-200/80 bg-white/80 p-6 shadow-sm sm:p-8 lg:col-span-3">
            <h3 className="font-display text-xl font-semibold text-charcoal">
              Weekly schedule
            </h3>
            <div className="mt-5">
              <HoursGrid />
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-blush-200/80 bg-white/80 p-6 shadow-sm sm:p-8 lg:col-span-2">
            <h3 className="font-display text-xl font-semibold text-charcoal">
              Visit the studio
            </h3>
            <address className="mt-5 space-y-4 text-sm not-italic leading-relaxed text-charcoal/75">
              <p>
                <span className="block font-medium text-charcoal">
                  {siteConfig.name}
                </span>
                {getFullAddress()}
              </p>
              <p>
                <a
                  href={getPhoneHref()}
                  className="font-medium text-blush-600 transition hover:text-blush-700"
                >
                  {siteConfig.phone}
                </a>
              </p>
            </address>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={getMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border-2 border-blush-300 bg-white/60 px-6 py-3 text-sm font-medium text-blush-600 transition hover:border-blush-400 hover:bg-white"
              >
                Get directions →
              </a>
              <BookButton size="md" className="w-full sm:w-auto lg:w-full" />
            </div>

            <p className="mt-6 text-sm text-charcoal/60">
              Questions before you book?{" "}
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blush-600 transition hover:text-blush-700"
              >
                DM us on Instagram
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
