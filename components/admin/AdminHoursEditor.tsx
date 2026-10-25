"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdminFloatingSaveButton } from "@/components/admin/AdminFloatingSaveButton";
import { DayHoursEditorRow } from "@/components/admin/DayHoursEditorRow";
import { HOURS_EDITOR_ROW_GRID } from "@/components/admin/hours-editor-layout";
import {
  DAY_KEYS,
  getDefaultHoursSchedule,
  type DayKey,
} from "@/lib/hours";
import {
  formatHoursDisplay,
  parseHoursText,
  snapMinutesToStep,
  validateDayHours,
  type DayHoursValue,
} from "@/lib/hours-format";
import {
  cloneHoursDays,
  countHoursDayChanges,
} from "@/lib/admin-change-count";
import {
  loadBusinessHoursForAdmin,
  saveBusinessHours,
} from "@/lib/supabase/hours-admin";

const HOURS_FORM_ID = "admin-hours-form";

function scheduleToDayValues(
  schedule: { dayKey: DayKey; hours: string }[],
): DayHoursValue[] {
  return schedule.map((entry) => {
    const parsed = parseHoursText(entry.dayKey, entry.hours);
    return {
      ...parsed,
      startMinutes: snapMinutesToStep(parsed.startMinutes),
      endMinutes: snapMinutesToStep(parsed.endMinutes),
    };
  });
}

export function AdminHoursEditor() {
  const [days, setDays] = useState<DayHoursValue[]>(() =>
    scheduleToDayValues(getDefaultHoursSchedule()),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [baselineDays, setBaselineDays] = useState<DayHoursValue[]>([]);

  const validationByDay = useMemo(() => {
    return Object.fromEntries(
      days.map((day) => [day.dayKey, validateDayHours(day)]),
    ) as Record<DayKey, string | null>;
  }, [days]);

  const hasValidationErrors = DAY_KEYS.some(
    (key) => validationByDay[key] !== null,
  );

  const changeCount = useMemo(
    () => countHoursDayChanges(days, baselineDays),
    [days, baselineDays],
  );

  const loadHours = useCallback(async () => {
    setLoading(true);
    try {
      const schedule = await loadBusinessHoursForAdmin();
      const nextDays = scheduleToDayValues(schedule);
      setDays(nextDays);
      setBaselineDays(cloneHoursDays(nextDays));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load business hours.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHours();
  }, [loadHours]);

  function updateDay(next: DayHoursValue) {
    setDays((prev) =>
      prev.map((day) => (day.dayKey === next.dayKey ? next : day)),
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (hasValidationErrors) {
      setError("Fix the highlighted days before saving.");
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    const hoursByDay = Object.fromEntries(
      days.map((day) => [day.dayKey, formatHoursDisplay(day)]),
    ) as Record<DayKey, string>;

    const result = await saveBusinessHours(hoursByDay);

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage("Hours saved. The public site will show these times right away.");
    await loadHours();
  }

  function handleReset() {
    setDays(scheduleToDayValues(getDefaultHoursSchedule()));
    setMessage(null);
    setError(null);
  }

  return (
    <section className="rounded-xl border border-blush-200 bg-white/80 p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-semibold text-charcoal">
            Business hours
          </h2>
          <p className="mt-1 text-xs text-charcoal/60">
            Toggle a day on, set times, then save.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading hours…</p>
      ) : (
        <form
          id={HOURS_FORM_ID}
          onSubmit={handleSubmit}
          className={`space-y-4 ${changeCount > 0 ? "pb-24" : ""}`}
        >
          <ul className="overflow-x-auto rounded-lg border border-blush-100 bg-blush-50/20 px-3 pb-1 pt-2">
            <li
              className={`${HOURS_EDITOR_ROW_GRID} border-b border-blush-100 pb-2 text-[10px] font-medium uppercase tracking-wide text-charcoal/45`}
              aria-hidden
            >
              <span>Day</span>
              <span className="text-center">Open</span>
              <span>From</span>
              <span>To</span>
              <span className="text-right">On site</span>
            </li>
            {days.map((day) => (
              <DayHoursEditorRow
                key={day.dayKey}
                value={day}
                validationError={validationByDay[day.dayKey]}
                onChange={updateDay}
              />
            ))}
          </ul>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-lg bg-blush-50 px-3 py-2 text-xs text-blush-800">
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="cursor-pointer rounded-full border border-blush-300 px-5 py-2 text-xs font-medium text-charcoal transition hover:bg-blush-50 disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </form>
      )}

      <AdminFloatingSaveButton
        formId={HOURS_FORM_ID}
        changeCount={changeCount}
        saving={saving}
        disabled={hasValidationErrors}
        label="Save hours"
      />
    </section>
  );
}
