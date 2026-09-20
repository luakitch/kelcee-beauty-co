import type { Metadata } from "next";
import { BookButton } from "@/components/BookButton";
import { BowAccent } from "@/components/BowAccent";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about Kelcee and the story behind ${siteConfig.name}.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Kelcee"
        description="Meet Kelcee and learn about the studio."
      />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blush-100 via-blush-200 to-rose-200">
            <BowAccent size={80} className="text-blush-400/60" />
            <p className="absolute bottom-6 rounded-full bg-white/70 px-4 py-2 text-sm text-charcoal/60 backdrop-blur-sm">
              Photo coming soon
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-3xl font-semibold text-charcoal">
              Hi, I&apos;m Kelcee!
            </h2>
            <p className="leading-relaxed text-charcoal/75">
              I started {siteConfig.name} because I believe every client deserves
              to leave the chair feeling confident and like themselves. My
              focus is lived-in color and styles that look great and are easy to
              maintain at home.
            </p>
            <p className="leading-relaxed text-charcoal/75">
              With years of experience behind the chair, I&apos;ve built a space
              that&apos;s warm and welcoming — good conversation, honest advice,
              and results you can count on.
            </p>
            <p className="leading-relaxed text-charcoal/75">
              When I&apos;m not doing hair, you&apos;ll find me staying on top of
              new techniques and trends so I can bring fresh ideas to every
              appointment. I look forward to meeting you!
            </p>
            <BookButton />
          </div>
        </div>
      </section>
    </>
  );
}
