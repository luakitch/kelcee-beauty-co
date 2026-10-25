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

const labelClassName =
  "mb-1 block text-[10px] font-medium uppercase tracking-wide text-charcoal/45";

type DayHoursEditorRowProps = {
  value: DayHoursValue;
  validationError: string | null;
  onChange: (value: DayHoursValue) => void;
};

function OpenToggle({
  dayKey,
  isOpen,
  onToggle,
}: {
  dayKey: DayKey;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}) {
  return (
    <label className="relative inline-flex h-5 w-9 shrink-0 items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={isOpen}
        onChange={(event) => onToggle(event.target.checked)}
        aria-label={`${DAY_LABELS[dayKey]} open`}
      />
      <span className="absolute inset-0 rounded-full bg-blush-200 transition peer-checked:bg-blush-500" />
      <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
    </label>
  );
}

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
      className={`border-b border-blush-100 last:border-b-0 md:py-2 ${
        validationError ? "bg-red-50/50" : ""
      }`}
    >
      <div className="space-y-3 rounded-lg border border-blush-100 bg-white px-3 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-charcoal">
            {DAY_LABELS[value.dayKey]}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wide text-charcoal/45">
              Open
            </span>
            <OpenToggle
              dayKey={value.dayKey}
              isOpen={!value.isClosed}
              onToggle={(open) => setClosed(!open)}
            />
          </div>
        </div>

        {value.isClosed ? (
          <p className="text-sm text-charcoal/50">Closed</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <span className={labelClassName}>From</span>
              <HoursTimeSelect
                id={`start-${value.dayKey}-mobile`}
                value={value.startMinutes}
                onChange={setStart}
                options={TIME_OPTIONS}
                aria-label={`${DAY_LABELS[value.dayKey]} opens`}
              />
            </div>
            <div className="min-w-0">
              <span className={labelClassName}>To</span>
              <HoursTimeSelect
                id={`end-${value.dayKey}-mobile`}
                value={value.endMinutes}
                onChange={setEnd}
                options={TIME_OPTIONS}
                aria-label={`${DAY_LABELS[value.dayKey]} closes`}
              />
            </div>
          </div>
        )}

        <p className="text-xs text-charcoal/45">
          <span className="font-medium text-charcoal/55">On site:</span>{" "}
          {preview}
        </p>
      </div>

      <div className={`hidden ${HOURS_EDITOR_ROW_GRID} md:grid`}>
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
          <span
            className="col-span-2 flex h-8 min-w-0 items-center text-xs text-charcoal/50"
            aria-hidden
          >
            Closed
          </span>
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
          className="min-w-0 truncate text-right text-xs text-charcoal/45"
          title={preview}
        >
          {preview}
        </span>
      </div>

      {validationError && (
        <p className="mt-2 px-1 text-xs text-red-600 md:mt-1 md:px-0">
          {validationError}
        </p>
      )}
    </li>
  );
}
