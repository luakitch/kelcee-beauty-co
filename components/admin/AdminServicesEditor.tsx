"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdminAddServiceModal } from "@/components/admin/AdminAddServiceModal";
import { AdminFloatingSaveButton } from "@/components/admin/AdminFloatingSaveButton";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { SaleToggle } from "@/components/admin/SaleToggle";
import { ServiceDollarInput } from "@/components/admin/ServiceDollarInput";
import { ServiceDurationInputs } from "@/components/admin/ServiceDurationInputs";
import {
  getDefaultCatalogServices,
  type CatalogService,
} from "@/lib/catalog-service";
import { formatPriceDollars } from "@/lib/service-format";
import {
  serviceCategories,
  type ServiceCategory,
} from "@/lib/site-config";
import {
  cloneServiceDrafts,
  countServiceDraftChanges,
} from "@/lib/admin-change-count";
import { useAdminCatalogServices } from "@/components/admin/AdminCatalogServicesContext";
import {
  loadCatalogServicesForAdmin,
  saveCatalogServices,
  validateServiceDraft,
  type ServiceDraft,
} from "@/lib/supabase/catalog-services-admin";

const SERVICES_FORM_ID = "admin-services-form";

function toDraft(service: CatalogService): ServiceDraft {
  return {
    clientKey: service.id ?? `name:${service.name}`,
    isNew: false,
    name: service.name,
    description: service.description,
    priceText: service.priceText,
    duration: service.duration,
    category: service.category,
    sortOrder: service.sortOrder,
    isOnSale: service.isOnSale,
    salePriceText: service.salePriceText ?? "",
  };
}

function createEmptyDraft(category: ServiceCategory, sortOrder: number): ServiceDraft {
  return {
    clientKey: crypto.randomUUID(),
    isNew: true,
    name: "",
    description: "",
    priceText: formatPriceDollars(25),
    duration: "1 hr",
    category,
    sortOrder,
    isOnSale: false,
    salePriceText: "",
  };
}

const inputClassName =
  "w-full rounded-xl border border-blush-200 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-200";

const labelClassName =
  "mb-2 block text-xs font-medium uppercase tracking-wide text-charcoal/50";

function adminServiceElementId(clientKey: string) {
  return `admin-service-${clientKey}`;
}

type AdminServiceCardProps = {
  draft: ServiceDraft;
  validationError: string | null;
  isLanding?: boolean;
  onUpdate: (patch: Partial<ServiceDraft>) => void;
  onDelete: () => void;
};

function AdminServiceCard({
  draft,
  validationError,
  isLanding = false,
  onUpdate,
  onDelete,
}: AdminServiceCardProps) {
  const fieldId = draft.clientKey.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  return (
    <article
      id={adminServiceElementId(draft.clientKey)}
      className={`flex h-full scroll-mt-28 flex-col rounded-2xl border bg-white/80 p-5 shadow-sm ${
        isLanding ? "admin-service-land" : ""
      } ${
        validationError
          ? "border-rose-300 ring-1 ring-rose-200"
          : draft.isOnSale
            ? "border-rose-200/80 ring-1 ring-rose-100"
            : "border-blush-200/80"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {draft.isNew ? (
            <label className="block">
              <span className={labelClassName}>Service name</span>
              <input
                type="text"
                value={draft.name}
                onChange={(event) => onUpdate({ name: event.target.value })}
                placeholder="e.g. Women's Haircut"
                className={inputClassName}
              />
            </label>
          ) : (
            <>
              <h4 className="font-display text-lg font-semibold leading-snug text-charcoal">
                {draft.name}
              </h4>
              <p className="mt-1 text-xs font-medium text-charcoal/45">
                {draft.category}
              </p>
            </>
          )}
        </div>
        <SaleToggle
          id={`${fieldId}-sale`}
          checked={draft.isOnSale}
          onChange={(checked) =>
            onUpdate({
              isOnSale: checked,
              salePriceText: checked ? draft.salePriceText : "",
            })
          }
        />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {draft.isNew && (
          <label className="block">
            <span className={labelClassName}>Category</span>
            <select
              value={draft.category}
              onChange={(event) =>
                onUpdate({ category: event.target.value as ServiceCategory })
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
        )}

        <label className="block">
          <span className={labelClassName}>Description</span>
          <textarea
            rows={3}
            value={draft.description}
            onChange={(event) => onUpdate({ description: event.target.value })}
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className={labelClassName}>Price</span>
          <ServiceDollarInput
            id={`${fieldId}-price`}
            value={draft.priceText}
            onChange={(priceText) => onUpdate({ priceText })}
            aria-label={`Price for ${draft.name || "new service"}`}
          />
        </label>

        <div className="block">
          <span className={labelClassName}>Duration</span>
          <ServiceDurationInputs
            idPrefix={`${fieldId}-duration`}
            value={draft.duration}
            onChange={(duration) => onUpdate({ duration })}
          />
        </div>

        {draft.isOnSale && (
          <label className="block">
            <span className={labelClassName}>Sale price</span>
            <ServiceDollarInput
              id={`${fieldId}-sale-price`}
              value={draft.salePriceText}
              onChange={(salePriceText) => onUpdate({ salePriceText })}
              aria-label={`Sale price for ${draft.name || "new service"}`}
            />
          </label>
        )}
      </div>

      {validationError && (
        <p className="mt-3 text-sm text-rose-700">{validationError}</p>
      )}

      <button
        type="button"
        onClick={onDelete}
        className="mt-4 -ml-1 cursor-pointer self-start rounded-lg px-2 py-1.5 text-xs font-medium text-rose-600 transition-all duration-200 hover:scale-[1.02] hover:bg-rose-50 hover:text-rose-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2"
      >
        Delete service
      </button>
    </article>
  );
}

export function AdminServicesEditor() {
  const { setServiceDrafts, refreshSavedServices } = useAdminCatalogServices();
  const [drafts, setDrafts] = useState<ServiceDraft[]>(() =>
    getDefaultCatalogServices().map(toDraft),
  );
  const [savedNames, setSavedNames] = useState<string[]>([]);
  const [baselineDrafts, setBaselineDrafts] = useState<ServiceDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draftToDelete, setDraftToDelete] = useState<ServiceDraft | null>(null);
  const [addModalDraft, setAddModalDraft] = useState<ServiceDraft | null>(null);
  const [landingServiceKey, setLandingServiceKey] = useState<string | null>(
    null,
  );

  const validationByKey = useMemo(() => {
    return Object.fromEntries(
      drafts.map((draft) => [
        draft.clientKey,
        validateServiceDraft(draft, drafts),
      ]),
    ) as Record<string, string | null>;
  }, [drafts]);

  const hasValidationErrors = drafts.some(
    (draft) => validationByKey[draft.clientKey] !== null,
  );

  const changeCount = useMemo(
    () => countServiceDraftChanges(drafts, baselineDrafts),
    [drafts, baselineDrafts],
  );

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const services = await loadCatalogServicesForAdmin();
      const nextDrafts = services.map(toDraft);
      setDrafts(nextDrafts);
      setBaselineDrafts(cloneServiceDrafts(nextDrafts));
      setSavedNames(nextDrafts.map((draft) => draft.name.trim()).filter(Boolean));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load services.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    if (!loading) {
      setServiceDrafts(drafts);
    }
  }, [drafts, loading, setServiceDrafts]);

  useEffect(() => {
    return () => setServiceDrafts(null);
  }, [setServiceDrafts]);

  useEffect(() => {
    if (!landingServiceKey) {
      return;
    }

    const clientKey = landingServiceKey;
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    let clearTimer: ReturnType<typeof setTimeout> | undefined;

    const scrollToCard = () => {
      const element = document.getElementById(adminServiceElementId(clientKey));
      if (!element) {
        return;
      }
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    scrollTimer = setTimeout(() => {
      requestAnimationFrame(scrollToCard);
    }, 50);

    clearTimer = setTimeout(() => {
      setLandingServiceKey((current) =>
        current === clientKey ? null : current,
      );
    }, 650);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
  }, [landingServiceKey]);

  function updateDraft(clientKey: string, patch: Partial<ServiceDraft>) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.clientKey === clientKey ? { ...draft, ...patch } : draft,
      ),
    );
  }

  function openAddServiceModal(category: ServiceCategory) {
    const maxSort = drafts.reduce(
      (max, draft) => Math.max(max, draft.sortOrder),
      0,
    );
    setAddModalDraft(createEmptyDraft(category, maxSort + 1));
  }

  function confirmAddService(draft: ServiceDraft) {
    setDrafts((prev) => [...prev, draft]);
    setAddModalDraft(null);
    setLandingServiceKey(draft.clientKey);
  }

  function removeDraft(clientKey: string) {
    setDrafts((prev) => prev.filter((draft) => draft.clientKey !== clientKey));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (hasValidationErrors) {
      setError("Fix the highlighted services before saving.");
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    const result = await saveCatalogServices(drafts, savedNames);

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage("Services saved.");
    await loadServices();
    await refreshSavedServices();
  }

  return (
    <section className="rounded-2xl border border-blush-200 bg-white/80 p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-charcoal">
            Services & pricing
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-charcoal/70">
            Update descriptions, prices, and durations shown on the website.
            Turn on a sale to show the discounted price and list the service in
            the sales section.
          </p>
        </div>
        <span className="text-sm text-charcoal/60">
          {drafts.length} service{drafts.length === 1 ? "" : "s"}
        </span>
      </div>

      {(message || error) && (
        <div
          className={`mt-6 rounded-xl px-4 py-3 text-sm ${
            error
              ? "bg-rose-100 text-charcoal"
              : "bg-blush-100 text-charcoal/80"
          }`}
        >
          {error ?? message}
        </div>
      )}

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/5] animate-pulse rounded-2xl bg-blush-100"
            />
          ))}
        </div>
      ) : (
        <form
          id={SERVICES_FORM_ID}
          onSubmit={handleSubmit}
          className={`mt-8 space-y-10 ${changeCount > 0 ? "pb-24" : ""}`}
        >
          {serviceCategories.map((category) => {
            const categoryDrafts = drafts.filter(
              (draft) => draft.category === category,
            );

            return (
              <div key={category} className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-charcoal">
                    {category}
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      openAddServiceModal(category as ServiceCategory)
                    }
                    className="cursor-pointer rounded-full border border-blush-300 bg-white px-4 py-2 text-xs font-semibold text-blush-600 transition-all duration-200 hover:scale-[1.04] hover:border-blush-400 hover:bg-blush-50 hover:text-blush-700 hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-300 focus-visible:ring-offset-2"
                  >
                    + Add service
                  </button>
                </div>

                {categoryDrafts.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-blush-200 bg-blush-50/40 px-4 py-8 text-center text-sm text-charcoal/55">
                    No services in this category yet.
                  </p>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {categoryDrafts.map((draft) => (
                      <AdminServiceCard
                        key={draft.clientKey}
                        draft={draft}
                        validationError={validationByKey[draft.clientKey]}
                        isLanding={landingServiceKey === draft.clientKey}
                        onUpdate={(patch) =>
                          updateDraft(draft.clientKey, patch)
                        }
                        onDelete={() => setDraftToDelete(draft)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <p className="border-t border-blush-200 pt-6 text-xs text-charcoal/50">
            Square booking prices are separate — update Square when you change
            real pricing.
          </p>
        </form>
      )}

      <AdminFloatingSaveButton
        formId={SERVICES_FORM_ID}
        changeCount={changeCount}
        saving={saving}
        disabled={hasValidationErrors}
        label="Save services"
      />

      {addModalDraft && (
        <AdminAddServiceModal
          open
          initialDraft={addModalDraft}
          existingDrafts={drafts}
          onConfirm={confirmAddService}
          onCancel={() => setAddModalDraft(null)}
        />
      )}

      <ConfirmDialog
        open={draftToDelete !== null}
        title="Delete service?"
        description={
          draftToDelete
            ? `Remove “${draftToDelete.name || "this service"}” from the website? Save services to apply permanently.`
            : ""
        }
        confirmLabel="Remove"
        cancelLabel="Keep"
        onConfirm={() => {
          if (draftToDelete) {
            removeDraft(draftToDelete.clientKey);
          }
          setDraftToDelete(null);
        }}
        onCancel={() => setDraftToDelete(null)}
      />
    </section>
  );
}
