"use client";

type SaleToggleProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export function SaleToggle({
  id,
  checked,
  onChange,
  label = "Sale",
}: SaleToggleProps) {
  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-2 ${
        checked
          ? "border-blush-400 bg-gradient-to-r from-blush-400 to-rose-400 text-white shadow-sm shadow-blush-300/50 hover:shadow-md hover:shadow-blush-400/40"
          : "border-blush-200 bg-blush-50/80 text-charcoal/75 hover:border-blush-400 hover:bg-blush-100/90 hover:shadow-sm"
      }`}
    >
      <span
        className={`flex size-5 items-center justify-center rounded-md border transition-all duration-200 group-hover:scale-110 group-active:scale-95 ${
          checked
            ? "border-white/40 bg-white/20"
            : "border-blush-300 bg-white group-hover:border-blush-400"
        }`}
        aria-hidden
      >
        <svg
          viewBox="0 0 16 16"
          className={`size-3.5 transition-all duration-200 ${
            checked
              ? "scale-100 opacity-100 group-hover:scale-110"
              : "scale-75 opacity-0 group-hover:scale-90 group-hover:opacity-35"
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
      {label}
    </button>
  );
}
