import type { CatalogService } from "@/lib/catalog-service";
import {
  isValidDuration,
  parseDurationText,
  parsePriceText,
} from "@/lib/service-format";
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
  clientKey: string;
  isNew: boolean;
  name: string;
  description: string;
  priceText: string;
  duration: string;
  category: string;
  sortOrder: number;
  isOnSale: boolean;
  salePriceText: string;
};

export function validateServiceDraft(
  draft: ServiceDraft,
  allDrafts: ServiceDraft[],
): string | null {
  const name = draft.name.trim();
  if (!name) {
    return "Service name is required.";
  }

  const duplicate = allDrafts.some(
    (other) =>
      other.clientKey !== draft.clientKey &&
      other.name.trim().toLowerCase() === name.toLowerCase(),
  );
  if (duplicate) {
    return "Another service already uses this name.";
  }

  if (!draft.description.trim()) {
    return "Description is required.";
  }

  const price = parsePriceText(draft.priceText);
  if (price === null) {
    return "Enter a valid price (e.g. $25 or $19.99).";
  }

  const duration = parseDurationText(draft.duration);
  if (!isValidDuration(duration)) {
    return "Choose hours and/or minutes for duration.";
  }

  if (draft.isOnSale) {
    const salePrice = parsePriceText(draft.salePriceText);
    if (salePrice === null) {
      return "Enter a valid sale price or turn off the sale.";
    }
    if (salePrice >= price) {
      return "Sale price must be lower than the regular price.";
    }
  }

  return null;
}

export async function saveCatalogServices(
  drafts: ServiceDraft[],
  previousNames: string[],
): Promise<{ error: string | null }> {
  const supabase = requireClient();
  const table = getCatalogServicesTable();

  const rows = drafts.map((draft) => ({
    name: draft.name.trim(),
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

  const { error } = await supabase.from(table).upsert(rows, {
    onConflict: "name",
  });

  if (error) {
    return { error: error.message };
  }

  const currentNames = new Set(rows.map((row) => row.name));
  const namesToDelete = previousNames.filter((name) => !currentNames.has(name));

  if (namesToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .in("name", namesToDelete);

    if (deleteError) {
      return { error: deleteError.message };
    }
  }

  return { error: null };
}
