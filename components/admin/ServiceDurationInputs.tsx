"use client";

import {
  formatDurationText,
  MAX_DURATION_HOURS,
  parseDurationText,
  snapMinutes,
  type ServiceDurationValue,
} from "@/lib/service-format";

const inputClassName =
  "w-full min-w-0 rounded-xl border border-blush-200 bg-white px-3 py-2 text-center text-sm text-charcoal outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-200";

const unitClassName =
  "shrink-0 text-sm font-medium text-charcoal/55";

type ServiceDurationInputsProps = {
  idPrefix: string;
  value: string;
  onChange: (duration: string) => void;
};

function clampHoursInput(raw: string): number | null {
  const digits = raw.replace(/\D/g, "");
  if (digits === "") {
    return 0;
  }
  const hours = Number(digits);
  if (!Number.isFinite(hours)) {
    return null;
  }
  return Math.min(MAX_DURATION_HOURS, Math.max(0, hours));
}

function clampMinutesInput(raw: string): number | null {
  const digits = raw.replace(/\D/g, "");
  if (digits === "") {
    return 0;
  }
  const minutes = Number(digits);
  if (!Number.isFinite(minutes)) {
    return null;
  }
  return Math.min(59, Math.max(0, minutes));
}

function commitDuration(
  partial: Partial<ServiceDurationValue>,
  current: ServiceDurationValue,
  onChange: (duration: string) => void,
) {
  const next: ServiceDurationValue = {
    hours: partial.hours ?? current.hours,
    minutes: partial.minutes ?? current.minutes,
  };
  onChange(formatDurationText(next));
}

export function ServiceDurationInputs({
  idPrefix,
  value,
  onChange,
}: ServiceDurationInputsProps) {
  const parsed = parseDurationText(value);

  return (
    <div className="flex items-center gap-2">
      <input
        id={`${idPrefix}-hours`}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label="Hours"
        value={parsed.hours === 0 ? "0" : String(parsed.hours)}
        onChange={(event) => {
          const hours = clampHoursInput(event.target.value);
          if (hours === null) return;
          commitDuration({ hours }, parsed, onChange);
        }}
        className={`${inputClassName} max-w-[4rem]`}
      />
      <span className={unitClassName}>hr</span>

      <input
        id={`${idPrefix}-minutes`}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label="Minutes"
        value={String(parsed.minutes)}
        onChange={(event) => {
          const minutes = clampMinutesInput(event.target.value);
          if (minutes === null) return;
          commitDuration({ minutes }, parsed, onChange);
        }}
        onBlur={() => {
          commitDuration({ minutes: snapMinutes(parsed.minutes) }, parsed, onChange);
        }}
        className={`${inputClassName} max-w-[4rem]`}
      />
      <span className={unitClassName}>min</span>
    </div>
  );
}
