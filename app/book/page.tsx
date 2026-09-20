import type { Metadata } from "next";
import { BookButton } from "@/components/BookButton";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Book",
  description: `Book an appointment with ${siteConfig.name} in ${siteConfig.location}.`,
};

export default function BookPage() {
  return (
    <>
      <PageHeader
        title="Book an Appointment"
        description="Choose your service and pick a time that works for you. Appointments are confirmed through Square."
      />

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="rounded-2xl border border-blush-200 bg-white/80 p-8 text-center shadow-sm sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blush-500">
            {siteConfig.location}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-charcoal">
            Ready to get on the books?
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-charcoal/70">
            You&apos;ll be taken to our secure Square booking page to pick a
            service, date, and time. It only takes a few minutes.
          </p>
          <div className="mt-8">
            <BookButton size="lg" />
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-blush-200/80 bg-blush-50/50 p-6 text-center">
          <p className="text-sm text-charcoal/70">
            Have questions before you book?{" "}
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blush-600 transition hover:text-blush-700"
            >
              Message us on Instagram
            </a>
            .
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-blush-200 bg-blush-50/50 p-8">
          <h2 className="font-display text-xl font-semibold text-charcoal">
            Booking policy
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
            A deposit may be required for color services — details are shown
            during booking. Please arrive 10 minutes early and let us know at
            least 24 hours in advance if you need to reschedule.
          </p>
        </div>
      </section>
    </>
  );
}
