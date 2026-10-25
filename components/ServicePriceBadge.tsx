import { GlimmerOverlay } from "@/components/GlimmerOverlay";
import { getServicePriceDisplay } from "@/lib/service-pricing";

type ServicePriceBadgeProps = {
  price: string;
  isOnSale?: boolean;
  salePrice?: string | null;
  glimmerSalePrice?: boolean;
  className?: string;
};

export function ServicePriceBadge({
  price,
  isOnSale = false,
  salePrice = null,
  glimmerSalePrice = false,
  className = "",
}: ServicePriceBadgeProps) {
  const { displayPrice, compareAtPrice, onSale } = getServicePriceDisplay({
    priceText: price,
    isOnSale,
    salePriceText: salePrice,
  });

  const showGlimmer = onSale && glimmerSalePrice;

  return (
    <span
      className={`inline-flex flex-col items-end gap-0.5 text-right ${className}`}
    >
      {onSale && compareAtPrice && (
        <span className="text-xs font-medium text-charcoal/45 line-through">
          {compareAtPrice}
        </span>
      )}
      <span
        className={`relative overflow-hidden rounded-full px-3 py-1 text-sm font-semibold ${
          onSale
            ? "bg-gradient-to-r from-rose-100 to-blush-100 text-rose-900 ring-1 ring-rose-200/80"
            : "bg-blush-100 text-blush-700"
        }`}
      >
        {showGlimmer && <GlimmerOverlay />}
        <span className="relative">{displayPrice}</span>
      </span>
    </span>
  );
}
