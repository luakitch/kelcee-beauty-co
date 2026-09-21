import type { CSSProperties } from "react";

type BowAccentProps = {
  className?: string;
  size?: number;
  /** Gentle float + pulse — intended for decorative hero accents */
  animated?: boolean;
  /** Phase offset in seconds — negative values stagger the loop on load */
  delay?: number;
  /** Full cycle length in seconds */
  duration?: number;
  /** Base opacity (0–1) */
  peak?: number;
};

function BowSvg({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M24 28C24 28 8 36 4 28C0 20 8 12 16 16C20 18 22 22 24 24C26 22 28 18 32 16C40 12 48 20 44 28C40 36 24 28 24 28Z"
        fill="currentColor"
        opacity="0.85"
      />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
      <path
        d="M22 25L20 38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M26 25L28 38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BowAccent({
  className = "",
  size = 48,
  animated = false,
  delay = 0,
  duration = 10,
  peak = 0.5,
}: BowAccentProps) {
  if (!animated) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M24 28C24 28 8 36 4 28C0 20 8 12 16 16C20 18 22 22 24 24C26 22 28 18 32 16C40 12 48 20 44 28C40 36 24 28 24 28Z"
          fill="currentColor"
          opacity="0.85"
        />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
        <path
          d="M22 25L20 38"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M26 25L28 38"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const motionClass = "motion-reduce:animate-none motion-reduce:opacity-70";
  const animationStyle = {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  } as CSSProperties;

  return (
    <div className={className} style={{ opacity: peak }} aria-hidden="true">
      <div
        className={`animate-bow-float ${motionClass}`}
        style={animationStyle}
      >
        <BowSvg size={size} />
      </div>
    </div>
  );
}

type BowDividerProps = {
  className?: string;
};

export function BowDivider({ className = "" }: BowDividerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-4 ${className}`}
      aria-hidden="true"
    >
      <span className="h-px w-16 bg-blush-300" />
      <BowAccent size={32} className="text-blush-400" />
      <span className="h-px w-16 bg-blush-300" />
    </div>
  );
}
