"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getDefaultHoursSchedule,
  getHoursForDay,
  type HoursScheduleEntry,
} from "@/lib/hours";
import { fetchBusinessHours } from "@/lib/supabase/hours";
import { getFullAddress, siteConfig } from "@/lib/site-config";

export function FooterVisitSection() {
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
    <div>
      <h3 className="mb-3 font-display text-base font-semibold text-charcoal">
        Visit Us
      </h3>
      <ul className="space-y-2 text-sm text-charcoal/70">
        <li>{getFullAddress()}</li>
        <li>Mon – Wed: {getHoursForDay(schedule, "monday")}</li>
        <li>Thu – Sat: {getHoursForDay(schedule, "thursday")}</li>
        <li>Sunday: {getHoursForDay(schedule, "sunday")}</li>
        <li>
          <Link
            href="/#hours"
            className="font-medium text-blush-600 transition hover:text-blush-700"
          >
            Full hours →
          </Link>
        </li>
      </ul>
      <a
        href={siteConfig.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm font-medium text-blush-600 transition hover:text-blush-700"
      >
        Follow on Instagram →
      </a>
    </div>
  );
}
