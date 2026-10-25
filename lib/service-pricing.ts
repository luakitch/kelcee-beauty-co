type PriceFields = {
  priceText: string;
  isOnSale: boolean;
  salePriceText: string | null;
};

export type ServicePriceDisplay = {
  displayPrice: string;
  compareAtPrice: string | null;
  onSale: boolean;
};

export function getServicePriceDisplay(
  service: PriceFields,
): ServicePriceDisplay {
  const salePrice = service.salePriceText?.trim();
  if (service.isOnSale && salePrice) {
    return {
      displayPrice: salePrice,
      compareAtPrice: service.priceText,
      onSale: true,
    };
  }

  return {
    displayPrice: service.priceText,
    compareAtPrice: null,
    onSale: false,
  };
}
