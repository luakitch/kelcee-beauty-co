export const MIN_SERVICE_PRICE = 0;
export const MAX_SERVICE_PRICE = 500;
export const MAX_DURATION_HOURS = 5;
export const DURATION_MINUTE_STEP = 5;

export type ServiceDurationValue = {
  hours: number;
  minutes: number;
};

export function formatPriceDollars(amount: number): string {
  if (!Number.isFinite(amount)) {
    return "";
  }

  const rounded = Math.round(amount * 100) / 100;
  if (rounded < MIN_SERVICE_PRICE || rounded > MAX_SERVICE_PRICE) {
    return "";
  }

  if (Number.isInteger(rounded)) {
    return `$${rounded}`;
  }

  return `$${rounded.toFixed(2)}`;
}

export function parsePriceText(text: string): number | null {
  const trimmed = text.trim();
  const match = trimmed.match(/^\$(\d+(?:\.\d{1,2})?)$/);
  if (!match) {
    return null;
  }

  const amount = Number(match[1]);
  if (
    !Number.isFinite(amount) ||
    amount < MIN_SERVICE_PRICE ||
    amount > MAX_SERVICE_PRICE
  ) {
    return null;
  }

  return Math.round(amount * 100) / 100;
}

/** Strip `$` and keep at most one decimal with up to 2 fractional digits. */
export function sanitizePriceAmountInput(raw: string): string {
  let value = raw.replace(/[^\d.]/g, "");
  const dotIndex = value.indexOf(".");
  if (dotIndex !== -1) {
    const whole = value.slice(0, dotIndex).replace(/\./g, "");
    const fraction = value.slice(dotIndex + 1).replace(/\./g, "").slice(0, 2);
    value =
      fraction.length > 0 || raw.endsWith(".")
        ? `${whole || "0"}.${fraction}`
        : whole;
  }

  return value;
}

export function priceTextFromAmountInput(amountInput: string): string {
  const sanitized = sanitizePriceAmountInput(amountInput);
  if (!sanitized) {
    return "";
  }
  return `$${sanitized}`;
}

export function snapMinutes(minutes: number): number {
  const snapped =
    Math.round(minutes / DURATION_MINUTE_STEP) * DURATION_MINUTE_STEP;
  return Math.min(55, Math.max(0, snapped));
}

export function parseDurationText(text: string): ServiceDurationValue {
  const trimmed = text.trim().toLowerCase();

  const combined = trimmed.match(/^(\d+)\s*hr(?:\s+(\d+)\s*min)?$/);
  if (combined) {
    return {
      hours: clampHours(Number(combined[1])),
      minutes: snapMinutes(Number(combined[2] ?? 0)),
    };
  }

  const minutesOnly = trimmed.match(/^(\d+)\s*min$/);
  if (minutesOnly) {
    return {
      hours: 0,
      minutes: snapMinutes(Number(minutesOnly[1])),
    };
  }

  return { hours: 1, minutes: 0 };
}

function clampHours(hours: number): number {
  return Math.min(MAX_DURATION_HOURS, Math.max(0, hours));
}

export function formatDurationText({ hours, minutes }: ServiceDurationValue): string {
  const h = clampHours(hours);
  const m = snapMinutes(minutes);

  if (h === 0 && m === 0) {
    return "30 min";
  }
  if (h === 0) {
    return `${m} min`;
  }
  if (m === 0) {
    return `${h} hr`;
  }
  return `${h} hr ${m} min`;
}

export function isValidDuration({ hours, minutes }: ServiceDurationValue): boolean {
  const h = clampHours(hours);
  const m = snapMinutes(minutes);
  return h > 0 || m > 0;
}
