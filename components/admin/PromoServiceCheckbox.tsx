"use client";

import type { ReactNode } from "react";

type PromoServiceCheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  trailing?: ReactNode;
};

export function PromoServiceCheckbox({
  id,
  checked,
  onChange,
  label,
  trailing,
}: PromoServiceCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-blush-50/80"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-blush-300 peer-focus-visible:ring-offset-2 ${
          checked
            ? "border-blush-400 bg-gradient-to-br from-blush-400 to-rose-400 shadow-sm shadow-blush-300/40"
            : "border-blush-300 bg-white"
        }`}
        aria-hidden
      >
        <svg
          viewBox="0 0 16 16"
          className={`size-3.5 text-white transition-all duration-200 ${
            checked ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
        </svg>
      </span>
      <span className="min-w-0 flex-1 text-sm font-medium text-charcoal">
        {label}
      </span>
      {trailing}
    </label>
  );
}
