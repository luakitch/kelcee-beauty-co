"use client";

type AdminFloatingSaveButtonProps = {
  changeCount: number;
  saving: boolean;
  disabled?: boolean;
  label: string;
  formId: string;
};

export function AdminFloatingSaveButton({
  changeCount,
  saving,
  disabled = false,
  label,
  formId,
}: AdminFloatingSaveButtonProps) {
  if (changeCount <= 0) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      aria-live="polite"
    >
      <button
        type="submit"
        form={formId}
        disabled={disabled || saving}
        className="pointer-events-auto flex cursor-pointer items-center gap-3 rounded-full bg-blush-500 py-3.5 pl-6 pr-4 text-sm font-semibold text-white shadow-lg shadow-blush-400/45 transition-all duration-200 hover:scale-[1.03] hover:bg-blush-600 hover:shadow-xl hover:shadow-blush-400/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        <span>{saving ? "Saving…" : label}</span>
        <span
          className="flex min-w-7 items-center justify-center rounded-full bg-white/25 px-2 py-0.5 text-xs font-bold tabular-nums"
          aria-label={`${changeCount} unsaved change${changeCount === 1 ? "" : "s"}`}
        >
          {changeCount}
        </span>
      </button>
    </div>
  );
}
