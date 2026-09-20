import { BowAccent } from "@/components/BowAccent";
import { siteConfig } from "@/lib/site-config";

type ServiceCardProps = {
  name: string;
  description: string;
  price: string;
  duration?: string;
  href?: string;
};

export function ServiceCard({
  name,
  description,
  price,
  duration,
  href = siteConfig.bookingUrl,
}: ServiceCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Book ${name}`}
      className="group block rounded-2xl border border-blush-200/80 bg-white/70 p-6 shadow-sm transition hover:border-blush-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <BowAccent
          size={28}
          className="shrink-0 text-blush-300 transition group-hover:text-blush-400"
        />
        <span className="rounded-full bg-blush-100 px-3 py-1 text-sm font-medium text-blush-700">
          {price}
        </span>
      </div>
      <h3 className="font-display text-xl font-semibold text-charcoal">{name}</h3>
      {duration && (
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-charcoal/45">
          {duration}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{description}</p>
      <p className="mt-4 text-sm font-medium text-blush-600 transition group-hover:text-blush-700">
        Book this service →
      </p>
    </a>
  );
}
