"use client";

type HoursTimeSelectProps = {
  id: string;
  value: number;
  onChange: (value: number) => void;
  options: { value: number; label: string }[];
  "aria-label": string;
};

export function HoursTimeSelect({
  id,
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: HoursTimeSelectProps) {
  return (
    <div className="relative w-[6.75rem] max-w-full">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={ariaLabel}
        className="h-8 w-full appearance-none rounded-lg border border-blush-200 bg-white py-0 pl-2.5 pr-9 text-xs text-charcoal outline-none focus:border-blush-400 focus:ring-1 focus:ring-blush-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/45"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
