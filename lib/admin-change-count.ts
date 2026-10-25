import type { DayHoursValue } from "@/lib/hours-format";
import type { ServiceDraft } from "@/lib/supabase/catalog-services-admin";

function normalizeServiceDraft(draft: ServiceDraft) {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
    priceText: draft.priceText.trim(),
    duration: draft.duration.trim(),
    category: draft.category,
    sortOrder: draft.sortOrder,
    isOnSale: draft.isOnSale,
    salePriceText: draft.isOnSale ? draft.salePriceText.trim() : "",
  };
}

export function countServiceDraftChanges(
  current: ServiceDraft[],
  baseline: ServiceDraft[],
): number {
  const baselineByKey = new Map(
    baseline.map((draft) => [draft.clientKey, normalizeServiceDraft(draft)]),
  );
  const currentByKey = new Map(
    current.map((draft) => [draft.clientKey, normalizeServiceDraft(draft)]),
  );

  let changes = 0;

  for (const key of baselineByKey.keys()) {
    if (!currentByKey.has(key)) {
      changes += 1;
    }
  }

  for (const [key, currentDraft] of currentByKey) {
    const baselineDraft = baselineByKey.get(key);
    if (!baselineDraft) {
      changes += 1;
      continue;
    }
    if (JSON.stringify(currentDraft) !== JSON.stringify(baselineDraft)) {
      changes += 1;
    }
  }

  return changes;
}

export function cloneServiceDrafts(drafts: ServiceDraft[]): ServiceDraft[] {
  return drafts.map((draft) => ({ ...draft }));
}

export function countHoursDayChanges(
  current: DayHoursValue[],
  baseline: DayHoursValue[],
): number {
  if (baseline.length === 0) {
    return 0;
  }

  const baselineByDay = new Map(
    baseline.map((day) => [day.dayKey, day]),
  );

  let changes = 0;
  for (const day of current) {
    const original = baselineByDay.get(day.dayKey);
    if (!original) {
      changes += 1;
      continue;
    }
    if (JSON.stringify(day) !== JSON.stringify(original)) {
      changes += 1;
    }
  }

  return changes;
}

export function cloneHoursDays(days: DayHoursValue[]): DayHoursValue[] {
  return days.map((day) => ({ ...day }));
}
