import {
  featuredServiceNames,
  serviceCategories,
  services as defaultServices,
  type Service,
  type ServiceCategory,
} from "@/lib/site-config";

export type CatalogService = {
  id: string | null;
  name: string;
  description: string;
  priceText: string;
  duration: string;
  category: ServiceCategory;
  sortOrder: number;
  isOnSale: boolean;
  salePriceText: string | null;
};

export type CatalogServiceRow = {
  id: string;
  name: string;
  description: string;
  price_text: string;
  duration: string;
  category: string;
  sort_order: number;
  is_on_sale: boolean;
  sale_price_text: string | null;
  updated_at: string;
};

export function rowToCatalogService(row: CatalogServiceRow): CatalogService {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceText: row.price_text,
    duration: row.duration,
    category: row.category as ServiceCategory,
    sortOrder: row.sort_order,
    isOnSale: row.is_on_sale,
    salePriceText: row.sale_price_text,
  };
}

export function defaultServiceToCatalog(
  service: Service,
  sortOrder: number,
): CatalogService {
  return {
    id: null,
    name: service.name,
    description: service.description,
    priceText: service.price,
    duration: service.duration,
    category: service.category,
    sortOrder,
    isOnSale: false,
    salePriceText: null,
  };
}

export function getDefaultCatalogServices(): CatalogService[] {
  let sortOrder = 0;
  const list: CatalogService[] = [];

  for (const category of serviceCategories) {
    for (const service of defaultServices.filter((s) => s.category === category)) {
      sortOrder += 1;
      list.push(defaultServiceToCatalog(service, sortOrder));
    }
  }

  return list;
}

export function mergeCatalogWithDefaults(
  rows: CatalogServiceRow[],
): CatalogService[] {
  if (rows.length === 0) {
    return getDefaultCatalogServices();
  }

  return rows
    .map(rowToCatalogService)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getOrderedCategoriesFromServices(
  services: Pick<CatalogService, "category">[],
): string[] {
  const present = new Set(services.map((service) => service.category));
  const ordered = serviceCategories.filter((category) => present.has(category));
  const extras = [...present].filter(
    (category) => !serviceCategories.includes(category as ServiceCategory),
  );
  return [...ordered, ...extras];
}

export function getServicesByCategoryFromCatalog(
  list: CatalogService[],
  category: string,
): CatalogService[] {
  return list.filter((service) => service.category === category);
}

export function getSaleServices(list: CatalogService[]): CatalogService[] {
  return list.filter(
    (service) => service.isOnSale && Boolean(service.salePriceText?.trim()),
  );
}

export function getFeaturedCatalogServices(list: CatalogService[]): CatalogService[] {
  return featuredServiceNames
    .map((name) => list.find((service) => service.name === name))
    .filter((service): service is CatalogService => service !== undefined);
}

export function catalogServiceToCardProps(service: CatalogService) {
  return {
    name: service.name,
    description: service.description,
    price: service.priceText,
    duration: service.duration,
    isOnSale: service.isOnSale,
    salePrice: service.salePriceText,
  };
}
