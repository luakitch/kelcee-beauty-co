"use client";

import { useEffect, useId, useState } from "react";
import { SaleToggle } from "@/components/admin/SaleToggle";
import { ServiceDollarInput } from "@/components/admin/ServiceDollarInput";
import { ServiceDurationInputs } from "@/components/admin/ServiceDurationInputs";
import { serviceCategories, type ServiceCategory } from "@/lib/site-config";
import {
  validateServiceDraft,
  type ServiceDraft,
} from "@/lib/supabase/catalog-services-admin";

const inputClassName =
  "w-full rounded-xl border border-blush-200 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-200";

const labelClassName =
  "mb-2 block text-xs font-medium uppercase tracking-wide text-charcoal/50";

type AdminAddServiceModalProps = {
  open: boolean;
  initialDraft: ServiceDraft;
  existingDrafts: ServiceDraft[];
  onConfirm: (draft: ServiceDraft) => void;
  onCancel: () => void;
};

export function AdminAddServiceModal({
  open,
  initialDraft,
  existingDrafts,
  onConfirm,
  onCancel,
}: AdminAddServiceModalProps) {
  const titleId = useId();
  const [draft, setDraft] = useState(initialDraft);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(initialDraft);
      setAttempted(false);
    }
  }, [open, initialDraft]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  const validationError = validateServiceDraft(draft, [
    ...existingDrafts,
    draft,
  ]);
  const showError = attempted && validationError !== null;

  const fieldId = draft.clientKey.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  function update(patch: Partial<ServiceDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleConfirm() {
    setAttempted(true);
    if (validationError) {
      return;
    }
    onConfirm(draft);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-blush-200 bg-white shadow-xl transition-transform duration-200"
      >
        <div className="flex items-start justify-between gap-4 border-b border-blush-100 px-6 py-5">
          <div>
            <h2
              id={titleId}
              className="font-display text-xl font-semibold text-charcoal"
            >
              Add service
            </h2>
            <p className="mt-1 text-sm text-charcoal/60">
              New services appear on the site after you save.
            </p>
          </div>
          <SaleToggle
            id={`${fieldId}-sale`}
            checked={draft.isOnSale}
            onChange={(checked) =>
              update({
                isOnSale: checked,
                salePriceText: checked ? draft.salePriceText : "",
              })
            }
          />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <label className="block">
            <span className={labelClassName}>Service name</span>
            <input
              type="text"
              autoFocus
              value={draft.name}
              onChange={(event) => update({ name: event.target.value })}
              placeholder="e.g. Women's Haircut"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Category</span>
            <select
              value={draft.category}
              onChange={(event) =>
                update({ category: event.target.value as ServiceCategory })
              }
              className={inputClassName}
            >
              {serviceCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelClassName}>Description</span>
            <textarea
              rows={3}
              value={draft.description}
              onChange={(event) => update({ description: event.target.value })}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className={labelClassName}>Price</span>
            <ServiceDollarInput
              id={`${fieldId}-price`}
              value={draft.priceText}
              onChange={(priceText) => update({ priceText })}
              aria-label="Price for new service"
            />
          </label>

          <div className="block">
            <span className={labelClassName}>Duration</span>
            <ServiceDurationInputs
              idPrefix={`${fieldId}-duration`}
              value={draft.duration}
              onChange={(duration) => update({ duration })}
            />
          </div>

          {draft.isOnSale && (
            <label className="block">
              <span className={labelClassName}>Sale price</span>
              <ServiceDollarInput
                id={`${fieldId}-sale-price`}
                value={draft.salePriceText}
                onChange={(salePriceText) => update({ salePriceText })}
                aria-label="Sale price for new service"
              />
            </label>
          )}

          {showError && (
            <p className="text-sm text-rose-700">{validationError}</p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-blush-100 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-blush-300 px-5 py-2.5 text-sm font-medium text-charcoal transition-all duration-200 hover:scale-[1.02] hover:bg-blush-50 active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-full bg-blush-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-blush-700 hover:shadow-md active:scale-[0.98]"
          >
            Add to list
          </button>
        </div>
      </div>
    </div>
  );
}
