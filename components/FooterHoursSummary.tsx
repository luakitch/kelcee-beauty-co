"use client";

import { useEffect, useState } from "react";
import {
  getDefaultHoursSchedule,
  getHoursForDay,
  type HoursScheduleEntry,
} from "@/lib/hours";
import { fetchBusinessHours } from "@/lib/supabase/hours";

export function FooterHoursSummary() {
  const [schedule, setSchedule] = useState<HoursScheduleEntry[]>(
    getDefaultHoursSchedule(),
  );

  useEffect(() => {
    let cancelled = false;

    fetchBusinessHours().then((data) => {
      if (!cancelled) {
        setSchedule(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <li>
        Mon – Wed: {getHoursForDay(schedule, "monday")}
      </li>
      <li>
        Thu – Sat: {getHoursForDay(schedule, "thursday")}
      </li>
      <li>Sunday: {getHoursForDay(schedule, "sunday")}</li>
    </>
  );
}
