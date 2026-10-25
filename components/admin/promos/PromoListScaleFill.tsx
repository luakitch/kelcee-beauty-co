"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type PromoListScaleFillProps = {
  children: ReactNode;
  fitKey: string;
};

/** Scale the sale list up (never down) to use available vertical space. */
export function PromoListScaleFill({ children, fitKey }: PromoListScaleFillProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const zone = zoneRef.current;
    const content = contentRef.current;
    if (!zone || !content) {
      return;
    }

    const measure = () => {
      const available = zone.clientHeight;
      const needed = content.offsetHeight;
      if (available <= 0 || needed <= 0) {
        setScale(1);
        return;
      }
      const target = available * 0.92;
      if (needed < target) {
        setScale(Math.min(1.35, target / needed));
      } else {
        setScale(1);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(zone);
    observer.observe(content);
    return () => observer.disconnect();
  }, [fitKey]);

  return (
    <div
      ref={zoneRef}
      className="flex h-full min-h-0 w-full items-center justify-center"
    >
      <div
        style={{
          transform: scale > 1 ? `scale(${scale})` : undefined,
          transformOrigin: "center center",
        }}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}
