import {
  getDefaultHoursSchedule,
  type DayKey,
  type HoursScheduleEntry,
} from "@/lib/hours";
import { getSupabaseClient } from "@/lib/supabase/client";
import { getBusinessHoursTable } from "@/lib/supabase/site-data-environment";

export type BusinessHourRow = {
  day_key: DayKey;
  label: string;
  hours_text: string;
  sort_order: number;
  updated_at: string;
};

function rowsToSchedule(rows: BusinessHourRow[]): HoursScheduleEntry[] {
  const defaults = getDefaultHoursSchedule();
  const byKey = new Map(rows.map((row) => [row.day_key, row.hours_text]));

  return defaults.map((entry) => ({
    ...entry,
    hours: byKey.get(entry.dayKey) ?? entry.hours,
  }));
}

export async function fetchBusinessHours(): Promise<HoursScheduleEntry[]> {
  const supabase = getSupabaseClient();
  const defaults = getDefaultHoursSchedule();

  if (!supabase) {
    return defaults;
  }

  const { data, error } = await supabase
    .from(getBusinessHoursTable())
    .select("day_key, label, hours_text, sort_order, updated_at")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return defaults;
  }

  return rowsToSchedule(data as BusinessHourRow[]);
}
