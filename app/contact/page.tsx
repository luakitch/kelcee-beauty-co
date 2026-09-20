import type { Metadata } from "next";
import { BookButton } from "@/components/BookButton";
import { BowAccent } from "@/components/BowAccent";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} — book online, email, or phone.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        description="Book online anytime — or reach out directly with questions."
      />

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mb-12 text-center">
          <BookButton size="lg" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <ContactCard title="Location" icon={<BowAccent size={24} className="text-blush-400" />}>
            <p>{siteConfig.location}</p>
          </ContactCard>

          <ContactCard title="Hours" icon={<BowAccent size={24} className="text-blush-400" />}>
            <p>{siteConfig.hours.weekdays}</p>
            <p>{siteConfig.hours.saturday}</p>
            <p>{siteConfig.hours.sunday}</p>
          </ContactCard>

          <ContactCard title="Email" icon={<BowAccent size={24} className="text-blush-400" />}>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-blush-600 transition hover:text-blush-700"
            >
              {siteConfig.email}
            </a>
          </ContactCard>

          <ContactCard title="Phone" icon={<BowAccent size={24} className="text-blush-400" />}>
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="text-blush-600 transition hover:text-blush-700"
            >
              {siteConfig.phone}
            </a>
          </ContactCard>
        </div>

        <div className="mt-12 rounded-2xl border border-blush-200 bg-blush-50/50 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-charcoal">
            Booking Policy
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-charcoal/70">
            Appointments are confirmed through Square when you book online. A
            deposit may be required for color services — details shown during
            booking. Please arrive 10 minutes early and let us know if you need
            to reschedule at least 24 hours in advance.
          </p>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-blush-200/80 bg-white/70 p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        {icon}
        <h3 className="font-display text-lg font-semibold text-charcoal">{title}</h3>
      </div>
      <div className="space-y-1 text-sm text-charcoal/70">{children}</div>
    </article>
  );
}
