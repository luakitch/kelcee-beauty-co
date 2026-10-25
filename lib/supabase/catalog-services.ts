import {
  getDefaultCatalogServices,
  mergeCatalogWithDefaults,
  type CatalogService,
  type CatalogServiceRow,
} from "@/lib/catalog-service";
import { getSupabaseClient } from "@/lib/supabase/client";
import { getCatalogServicesTable } from "@/lib/supabase/site-data-environment";

export async function fetchCatalogServices(): Promise<CatalogService[]> {
  const supabase = getSupabaseClient();
  const defaults = getDefaultCatalogServices();

  if (!supabase) {
    return defaults;
  }

  const { data, error } = await supabase
    .from(getCatalogServicesTable())
    .select(
      "id, name, description, price_text, duration, category, sort_order, is_on_sale, sale_price_text, updated_at",
    )
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return defaults;
  }

  return mergeCatalogWithDefaults(data as CatalogServiceRow[]);
}
