"use client";

import {
  formatPriceDollars,
  MAX_SERVICE_PRICE,
  parsePriceText,
  priceTextFromAmountInput,
  sanitizePriceAmountInput,
} from "@/lib/service-format";

const inputClassName =
  "min-w-0 flex-1 border-0 bg-transparent py-2 pl-3 pr-3 text-sm text-charcoal outline-none";

type ServiceDollarInputProps = {
  id: string;
  value: string;
  onChange: (priceText: string) => void;
  "aria-label": string;
};

function amountDisplayFromPriceText(priceText: string): string {
  const trimmed = priceText.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("$")) {
    return trimmed.slice(1);
  }
  return trimmed;
}

function isWithinMax(amountInput: string): boolean {
  if (!amountInput || amountInput === ".") {
    return true;
  }
  const normalized = amountInput.endsWith(".")
    ? amountInput.slice(0, -1)
    : amountInput;
  if (!normalized) {
    return true;
  }
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount <= MAX_SERVICE_PRICE;
}

export function ServiceDollarInput({
  id,
  value,
  onChange,
  "aria-label": ariaLabel,
}: ServiceDollarInputProps) {
  const display = amountDisplayFromPriceText(value);

  function handleChange(raw: string) {
    const sanitized = sanitizePriceAmountInput(raw);
    if (!sanitized) {
      onChange("");
      return;
    }
    if (!isWithinMax(sanitized)) {
      return;
    }
    onChange(priceTextFromAmountInput(sanitized));
  }

  function handleBlur() {
    const amount = parsePriceText(value);
    if (amount !== null) {
      onChange(formatPriceDollars(amount));
    }
  }

  return (
    <div className="flex items-center overflow-hidden rounded-xl border border-blush-200 bg-white focus-within:border-blush-400 focus-within:ring-2 focus-within:ring-blush-200">
      <span
        className="border-r border-blush-200 bg-blush-50/80 px-3 py-2 text-sm font-medium text-charcoal/70"
        aria-hidden
      >
        $
      </span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        aria-label={ariaLabel}
        value={display}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={handleBlur}
        placeholder="0.00"
        className={inputClassName}
      />
    </div>
  );
}
