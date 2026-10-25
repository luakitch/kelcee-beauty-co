import { getDefaultHoursSchedule, type DayKey } from "@/lib/hours";
import { getSupabaseClient } from "@/lib/supabase/client";
import { fetchBusinessHours } from "@/lib/supabase/hours";

function requireClient() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }
  return supabase;
}

export async function saveBusinessHours(
  hoursByDay: Record<DayKey, string>,
): Promise<{ error: string | null }> {
  const supabase = requireClient();
  const defaults = getDefaultHoursSchedule();

  const rows = defaults.map((entry, index) => ({
    day_key: entry.dayKey,
    label: entry.label,
    hours_text: hoursByDay[entry.dayKey]?.trim() || "Closed",
    sort_order: index + 1,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("business_hours").upsert(rows, {
    onConflict: "day_key",
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function loadBusinessHoursForAdmin() {
  return fetchBusinessHours();
}
