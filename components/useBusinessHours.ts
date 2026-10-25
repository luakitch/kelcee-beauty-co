"use client";

import { useEffect, useState } from "react";
import {
  getDefaultHoursSchedule,
  type HoursScheduleEntry,
} from "@/lib/hours";
import { fetchBusinessHours } from "@/lib/supabase/hours";

export function useBusinessHours() {
  const [schedule, setSchedule] = useState<HoursScheduleEntry[]>(
    getDefaultHoursSchedule(),
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchBusinessHours().then((data) => {
      if (!cancelled) {
        setSchedule(data);
        setLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { schedule, loaded };
}
