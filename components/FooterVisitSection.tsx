"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useBusinessHoursContext } from "@/components/BusinessHoursProvider";
import { getFooterHoursSummaryLines } from "@/lib/hours";
import { getFullAddress, siteConfig } from "@/lib/site-config";

export function FooterVisitSection() {
  const { schedule } = useBusinessHoursContext();
  const summaryLines = useMemo(
    () => getFooterHoursSummaryLines(schedule),
    [schedule],
  );

  return (
    <div>
      <h3 className="mb-3 font-display text-base font-semibold text-charcoal">
        Visit Us
      </h3>
      <ul className="space-y-2 text-sm text-charcoal/70">
        <li>{getFullAddress()}</li>
        {summaryLines.map((line) => (
          <li key={line.label}>
            {line.label}: {line.hours}
          </li>
        ))}
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
