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

const FOOTER_DAY_SHORT: Record<DayKey, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export type FooterHoursLine = {
  label: string;
  hours: string;
};

function normalizeHoursKey(hours: string): string {
  return hours.trim().replace(/\s+/g, " ").toLowerCase();
}

function footerDayRangeLabel(start: DayKey, end: DayKey): string {
  if (start === end) {
    return start === "sunday" ? "Sunday" : FOOTER_DAY_SHORT[start];
  }

  const endLabel = end === "sunday" ? "Sunday" : FOOTER_DAY_SHORT[end];
  return `${FOOTER_DAY_SHORT[start]} – ${endLabel}`;
}

/** Compact footer lines grouped from the live weekly schedule. */
export function getFooterHoursSummaryLines(
  schedule: HoursScheduleEntry[],
): FooterHoursLine[] {
  const byKey = new Map(schedule.map((entry) => [entry.dayKey, entry]));
  const ordered = DAY_KEYS.map(
    (dayKey) =>
      byKey.get(dayKey) ?? {
        dayKey,
        label: DAY_LABELS[dayKey],
        hours: "",
      },
  );

  const lines: FooterHoursLine[] = [];
  let rangeStart = 0;

  for (let index = 1; index <= ordered.length; index++) {
    const breaksRange =
      index === ordered.length ||
      normalizeHoursKey(ordered[rangeStart].hours) !==
        normalizeHoursKey(ordered[index].hours);

    if (breaksRange) {
      const start = ordered[rangeStart];
      const end = ordered[index - 1];
      lines.push({
        label: footerDayRangeLabel(start.dayKey, end.dayKey),
        hours: start.hours,
      });
      rangeStart = index;
    }
  }

  return lines;
}
