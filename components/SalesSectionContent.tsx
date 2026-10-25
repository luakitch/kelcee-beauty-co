import { BowDivider } from "@/components/BowAccent";
import { ServiceCard } from "@/components/ServiceCard";
import { catalogServiceToCardProps, type CatalogService } from "@/lib/catalog-service";

type SalesSectionContentProps = {
  saleServices: CatalogService[];
  id?: string;
  className?: string;
  showHeader?: boolean;
};

export function SalesSectionContent({
  saleServices,
  id = "sales",
  className = "",
  showHeader = true,
}: SalesSectionContentProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 bg-gradient-to-b from-rose-50/90 via-blush-50/50 to-cream px-4 py-16 sm:px-6 sm:py-20 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        {showHeader && (
          <div className="mb-10 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-rose-100/90 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 ring-1 ring-rose-200/80">
              <span aria-hidden>✦</span>
              Limited time
              <span aria-hidden>✦</span>
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              Current Sales
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
              Book these services at special pricing while the sale is on — spots
              fill fast.
            </p>
            <BowDivider className="mt-6" />
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saleServices.map((service) => (
            <ServiceCard
              key={service.name}
              {...catalogServiceToCardProps(service)}
              promoteSale
            />
          ))}
        </div>
      </div>
    </section>
  );
}
