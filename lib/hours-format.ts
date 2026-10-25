import type { DayKey } from "@/lib/hours";

export type DayHoursValue = {
  dayKey: DayKey;
  isClosed: boolean;
  /** Minutes from midnight, 0–1439 */
  startMinutes: number;
  endMinutes: number;
};

export const MINUTES_OPEN = 6 * 60;
export const MINUTES_CLOSE = 23 * 60 + 30;
export const TIME_STEP_MINUTES = 15;

export function buildTimeOptions(): { value: number; label: string }[] {
  const options: { value: number; label: string }[] = [];
  for (
    let minutes = MINUTES_OPEN;
    minutes <= MINUTES_CLOSE;
    minutes += TIME_STEP_MINUTES
  ) {
    options.push({ value: minutes, label: formatMinutesForPicker(minutes) });
  }
  return options;
}

export function formatMinutesForPicker(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  if (mins === 0) {
    return `${hours12} ${period}`;
  }
  return `${hours12}:${mins.toString().padStart(2, "0")} ${period}`;
}

/** Public site display string (matches existing style). */
export function formatHoursDisplay(value: DayHoursValue): string {
  if (value.isClosed) {
    return "Closed";
  }
  if (value.endMinutes <= value.startMinutes) {
    return "Closed";
  }
  return `${formatMinutesForSite(value.startMinutes)} – ${formatMinutesForSite(value.endMinutes)}`;
}

function formatMinutesForSite(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 >= 12 ? "pm" : "am";
  const hours12 = hours24 % 12 || 12;
  if (mins === 0) {
    return `${hours12}${period}`;
  }
  if (mins === 30 && hours12 !== 12) {
    return `${hours12}:${mins.toString().padStart(2, "0")}${period}`;
  }
  return `${hours12}:${mins.toString().padStart(2, "0")}${period}`;
}

function parseTimeToken(token: string): number | null {
  const normalized = token.trim().toLowerCase().replace(/\s+/g, "");
  const match = normalized.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/);
  if (!match) return null;

  let hours = Number.parseInt(match[1], 10);
  const mins = match[2] ? Number.parseInt(match[2], 10) : 0;
  const period = match[3];

  if (hours < 1 || hours > 12 || mins < 0 || mins > 59) {
    return null;
  }

  if (period === "am") {
    if (hours === 12) hours = 0;
  } else if (hours !== 12) {
    hours += 12;
  }

  return hours * 60 + mins;
}

export function parseHoursText(
  dayKey: DayKey,
  text: string,
): DayHoursValue {
  const fallback: DayHoursValue = {
    dayKey,
    isClosed: false,
    startMinutes: 9 * 60,
    endMinutes: 21 * 60,
  };

  const trimmed = text.trim();
  if (!trimmed || /^closed$/i.test(trimmed)) {
    return { ...fallback, isClosed: true };
  }

  const parts = trimmed.split(/\s*[–—-]\s*/);
  if (parts.length !== 2) {
    return fallback;
  }

  const startMinutes = parseTimeToken(parts[0]);
  const endMinutes = parseTimeToken(parts[1]);

  if (startMinutes === null || endMinutes === null) {
    return fallback;
  }

  return {
    dayKey,
    isClosed: false,
    startMinutes,
    endMinutes,
  };
}

export function validateDayHours(value: DayHoursValue): string | null {
  if (value.isClosed) return null;
  if (value.endMinutes <= value.startMinutes) {
    return "Closing time must be after opening time.";
  }
  return null;
}

export function snapMinutesToStep(minutes: number): number {
  const snapped =
    Math.round((minutes - MINUTES_OPEN) / TIME_STEP_MINUTES) *
      TIME_STEP_MINUTES +
    MINUTES_OPEN;
  return Math.min(Math.max(snapped, MINUTES_OPEN), MINUTES_CLOSE);
}
