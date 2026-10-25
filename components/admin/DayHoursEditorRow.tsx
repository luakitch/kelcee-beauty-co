"use client";

import type { DayKey } from "@/lib/hours";
import {
  buildTimeOptions,
  formatHoursDisplay,
  type DayHoursValue,
} from "@/lib/hours-format";
import { HoursTimeSelect } from "@/components/admin/HoursTimeSelect";
import { HOURS_EDITOR_ROW_GRID } from "@/components/admin/hours-editor-layout";

const DAY_LABELS: Record<DayKey, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const TIME_OPTIONS = buildTimeOptions();

type DayHoursEditorRowProps = {
  value: DayHoursValue;
  validationError: string | null;
  onChange: (value: DayHoursValue) => void;
};

export function DayHoursEditorRow({
  value,
  validationError,
  onChange,
}: DayHoursEditorRowProps) {
  const preview = formatHoursDisplay(value);

  function setClosed(isClosed: boolean) {
    onChange({ ...value, isClosed });
  }

  function setStart(startMinutes: number) {
    onChange({ ...value, startMinutes, isClosed: false });
  }

  function setEnd(endMinutes: number) {
    onChange({ ...value, endMinutes, isClosed: false });
  }

  return (
    <li
      className={`border-b border-blush-100 py-2 last:border-b-0 ${
        validationError ? "bg-red-50/50" : ""
      }`}
    >
      <div className={HOURS_EDITOR_ROW_GRID}>
        <span className="text-sm font-medium text-charcoal">
          {DAY_LABELS[value.dayKey]}
        </span>

        <label className="relative mx-auto inline-flex h-5 w-9 items-center justify-self-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={!value.isClosed}
            onChange={(event) => setClosed(!event.target.checked)}
            aria-label={`${DAY_LABELS[value.dayKey]} open`}
          />
          <span className="absolute inset-0 rounded-full bg-blush-200 transition peer-checked:bg-blush-500" />
          <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
        </label>

        {value.isClosed ? (
          <>
            <span
              className="col-span-2 flex h-8 w-[13.75rem] max-w-full items-center text-xs text-charcoal/50"
              aria-hidden
            >
              Closed
            </span>
          </>
        ) : (
          <>
            <HoursTimeSelect
              id={`start-${value.dayKey}`}
              value={value.startMinutes}
              onChange={setStart}
              options={TIME_OPTIONS}
              aria-label={`${DAY_LABELS[value.dayKey]} opens`}
            />
            <HoursTimeSelect
              id={`end-${value.dayKey}`}
              value={value.endMinutes}
              onChange={setEnd}
              options={TIME_OPTIONS}
              aria-label={`${DAY_LABELS[value.dayKey]} closes`}
            />
          </>
        )}

        <span
          className="truncate text-right text-xs text-charcoal/45"
          title={preview}
        >
          {preview}
        </span>
      </div>

      {validationError && (
        <p className="mt-1 text-xs text-red-600">{validationError}</p>
      )}
    </li>
  );
}
