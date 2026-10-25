import { getServicePriceDisplay } from "@/lib/service-pricing";

type ServicePriceBadgeProps = {
  price: string;
  isOnSale?: boolean;
  salePrice?: string | null;
  className?: string;
};

export function ServicePriceBadge({
  price,
  isOnSale = false,
  salePrice = null,
  className = "",
}: ServicePriceBadgeProps) {
  const { displayPrice, compareAtPrice, onSale } = getServicePriceDisplay({
    priceText: price,
    isOnSale,
    salePriceText: salePrice,
  });

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
        className={`rounded-full px-3 py-1 text-sm font-medium ${
          onSale
            ? "bg-rose-100 text-rose-800"
            : "bg-blush-100 text-blush-700"
        }`}
      >
        {onSale ? `Sale ${displayPrice}` : displayPrice}
      </span>
    </span>
  );
}
