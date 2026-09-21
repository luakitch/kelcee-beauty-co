"use client";

import { hoursSchedule } from "@/lib/site-config";

/** Monday = 0 … Sunday = 6 (matches hoursSchedule order) */
function getTodayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

export function HoursGrid() {
  const todayIndex = getTodayIndex();

  return (
    <ul className="flex flex-col gap-1">
      {hoursSchedule.map((entry, index) => {
        const isToday = index === todayIndex;
        const isClosed = entry.hours.toLowerCase() === "closed";

        return (
          <li
            key={entry.label}
            aria-current={isToday ? "date" : undefined}
            className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${
              isToday ? "bg-blush-100/80" : ""
            }`}
          >
            <span
              className={`font-medium ${
                isToday ? "text-charcoal" : "text-charcoal/80"
              }`}
            >
              {entry.label}
              {isToday && (
                <span className="ml-2 text-xs font-medium uppercase tracking-wide text-blush-600">
                  Today
                </span>
              )}
            </span>
            <span
              className={`text-right ${
                isClosed
                  ? "text-charcoal/45"
                  : isToday
                    ? "font-semibold text-blush-700"
                    : "text-charcoal/70"
              }`}
            >
              {entry.hours}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
