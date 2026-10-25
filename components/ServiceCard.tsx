import { BowAccent } from "@/components/BowAccent";
import { ServicePriceBadge } from "@/components/ServicePriceBadge";
import { siteConfig } from "@/lib/site-config";

type ServiceCardProps = {
  name: string;
  description: string;
  price: string;
  duration?: string;
  href?: string;
  isOnSale?: boolean;
  salePrice?: string | null;
  promoteSale?: boolean;
};

export function ServiceCard({
  name,
  description,
  price,
  duration,
  href = siteConfig.bookingUrl,
  isOnSale = false,
  salePrice = null,
  promoteSale = false,
}: ServiceCardProps) {
  const showSalePromo = promoteSale && isOnSale;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Book ${name}`}
      className={`group relative block rounded-2xl border p-6 transition hover:shadow-lg ${
        showSalePromo
          ? "border-rose-300/90 bg-gradient-to-br from-white via-rose-50/40 to-blush-50/30 shadow-md shadow-rose-100/50 ring-1 ring-rose-200/60 hover:border-rose-400"
          : "border-blush-200/80 bg-white/70 shadow-sm hover:border-blush-300 hover:shadow-md"
      }`}
    >
      {showSalePromo && (
        <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-rose-500 to-blush-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          Sale
        </span>
      )}

      <div className="mb-4 flex items-start justify-between gap-4">
        <BowAccent
          size={28}
          className={`shrink-0 transition ${
            showSalePromo
              ? "text-rose-300 group-hover:text-rose-400"
              : "text-blush-300 group-hover:text-blush-400"
          }`}
        />
        <ServicePriceBadge
          price={price}
          isOnSale={isOnSale}
          salePrice={salePrice}
          glimmerSalePrice={showSalePromo || isOnSale}
          className={showSalePromo ? "mt-6" : undefined}
        />
      </div>
      <h3 className="font-display text-xl font-semibold text-charcoal">{name}</h3>
      {duration && (
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-charcoal/45">
          {duration}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{description}</p>
      <p
        className={`mt-4 text-sm font-medium transition ${
          showSalePromo
            ? "text-rose-700 group-hover:text-rose-800"
            : "text-blush-600 group-hover:text-blush-700"
        }`}
      >
        {showSalePromo ? "Grab this deal →" : "Book this service →"}
      </p>
    </a>
  );
}
