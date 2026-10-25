import { siteConfig } from "@/lib/site-config";

export const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayKey = (typeof DAY_KEYS)[number];

export type HoursScheduleEntry = {
  dayKey: DayKey;
  label: string;
  hours: string;
};

const DAY_LABELS: Record<DayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function getDefaultHoursSchedule(): HoursScheduleEntry[] {
  return DAY_KEYS.map((dayKey) => ({
    dayKey,
    label: DAY_LABELS[dayKey],
    hours: siteConfig.hours[dayKey],
  }));
}

export function scheduleToMap(
  schedule: HoursScheduleEntry[],
): Record<DayKey, string> {
  return Object.fromEntries(
    schedule.map((entry) => [entry.dayKey, entry.hours]),
  ) as Record<DayKey, string>;
}

export function getHoursForDay(
  schedule: HoursScheduleEntry[],
  dayKey: DayKey,
): string {
  return schedule.find((entry) => entry.dayKey === dayKey)?.hours ?? "";
}
