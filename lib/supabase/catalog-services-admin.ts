import type { CatalogService } from "@/lib/catalog-service";
import { getSupabaseClient } from "@/lib/supabase/client";
import { fetchCatalogServices } from "@/lib/supabase/catalog-services";
import { getCatalogServicesTable } from "@/lib/supabase/site-data-environment";

function requireClient() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }
  return supabase;
}

export async function loadCatalogServicesForAdmin(): Promise<CatalogService[]> {
  return fetchCatalogServices();
}

export type ServiceDraft = {
  name: string;
  description: string;
  priceText: string;
  duration: string;
  category: string;
  sortOrder: number;
  isOnSale: boolean;
  salePriceText: string;
};

export function validateServiceDraft(draft: ServiceDraft): string | null {
  if (!draft.description.trim()) {
    return "Description is required.";
  }
  if (!draft.priceText.trim()) {
    return "Price is required.";
  }
  if (draft.isOnSale && !draft.salePriceText.trim()) {
    return "Enter a sale price or turn off the sale.";
  }
  return null;
}

export async function saveCatalogServices(
  drafts: ServiceDraft[],
): Promise<{ error: string | null }> {
  const supabase = requireClient();

  const rows = drafts.map((draft) => ({
    name: draft.name,
    description: draft.description.trim(),
    price_text: draft.priceText.trim(),
    duration: draft.duration.trim(),
    category: draft.category,
    sort_order: draft.sortOrder,
    is_on_sale: draft.isOnSale,
    sale_price_text: draft.isOnSale
      ? draft.salePriceText.trim() || null
      : null,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from(getCatalogServicesTable()).upsert(rows, {
    onConflict: "name",
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
