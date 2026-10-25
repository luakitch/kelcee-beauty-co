"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  getDefaultCatalogServices,
  type CatalogService,
} from "@/lib/catalog-service";
import { serviceCategories } from "@/lib/site-config";
import {
  loadCatalogServicesForAdmin,
  saveCatalogServices,
  validateServiceDraft,
  type ServiceDraft,
} from "@/lib/supabase/catalog-services-admin";

function toDraft(service: CatalogService): ServiceDraft {
  return {
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

export function AdminServicesEditor() {
  const [drafts, setDrafts] = useState<ServiceDraft[]>(() =>
    getDefaultCatalogServices().map(toDraft),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validationByName = useMemo(() => {
    return Object.fromEntries(
      drafts.map((draft) => [draft.name, validateServiceDraft(draft)]),
    ) as Record<string, string | null>;
  }, [drafts]);

  const hasValidationErrors = drafts.some(
    (draft) => validationByName[draft.name] !== null,
  );

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const services = await loadCatalogServicesForAdmin();
      setDrafts(services.map(toDraft));
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

  function updateDraft(name: string, patch: Partial<ServiceDraft>) {
    setDrafts((prev) =>
      prev.map((draft) =>
        draft.name === name ? { ...draft, ...patch } : draft,
      ),
    );
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

    const result = await saveCatalogServices(drafts);

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage("Services saved.");
    await loadServices();
  }

  return (
    <section className="rounded-2xl border border-blush-200 bg-white/80 p-6 shadow-sm">
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
        <div className="mt-8 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-blush-100"
            />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-10">
          {serviceCategories.map((category) => {
            const categoryDrafts = drafts.filter(
              (draft) => draft.category === category,
            );
            if (categoryDrafts.length === 0) return null;

            return (
              <div key={category} className="space-y-4">
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  {category}
                </h3>
                <div className="space-y-4">
                  {categoryDrafts.map((draft) => {
                    const validationError = validationByName[draft.name];

                    return (
                      <article
                        key={draft.name}
                        className={`rounded-xl border p-4 sm:p-5 ${
                          validationError
                            ? "border-rose-300 bg-rose-50/40"
                            : "border-blush-200 bg-blush-50/30"
                        }`}
                      >
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-display text-base font-semibold text-charcoal">
                            {draft.name}
                          </h4>
                          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-charcoal/80">
                            <input
                              type="checkbox"
                              checked={draft.isOnSale}
                              onChange={(event) =>
                                updateDraft(draft.name, {
                                  isOnSale: event.target.checked,
                                  salePriceText: event.target.checked
                                    ? draft.salePriceText
                                    : "",
                                })
                              }
                              className="size-4 rounded border-blush-300 text-blush-600 focus:ring-blush-300"
                            />
                            On sale
                          </label>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block sm:col-span-2">
                            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-charcoal/50">
                              Description
                            </span>
                            <textarea
                              rows={2}
                              value={draft.description}
                              onChange={(event) =>
                                updateDraft(draft.name, {
                                  description: event.target.value,
                                })
                              }
                              className="w-full rounded-xl border border-blush-200 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-200"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-charcoal/50">
                              Price (shown when not on sale)
                            </span>
                            <input
                              type="text"
                              value={draft.priceText}
                              onChange={(event) =>
                                updateDraft(draft.name, {
                                  priceText: event.target.value,
                                })
                              }
                              placeholder="$25"
                              className="w-full rounded-xl border border-blush-200 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-200"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-charcoal/50">
                              Duration
                            </span>
                            <input
                              type="text"
                              value={draft.duration}
                              onChange={(event) =>
                                updateDraft(draft.name, {
                                  duration: event.target.value,
                                })
                              }
                              placeholder="1 hr"
                              className="w-full rounded-xl border border-blush-200 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-200"
                            />
                          </label>

                          {draft.isOnSale && (
                            <label className="block sm:col-span-2">
                              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-charcoal/50">
                                Sale price (shown on site)
                              </span>
                              <input
                                type="text"
                                value={draft.salePriceText}
                                onChange={(event) =>
                                  updateDraft(draft.name, {
                                    salePriceText: event.target.value,
                                  })
                                }
                                placeholder="$20"
                                className="w-full rounded-xl border border-blush-200 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-200"
                              />
                            </label>
                          )}
                        </div>

                        {validationError && (
                          <p className="mt-3 text-sm text-rose-700">
                            {validationError}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="flex flex-wrap items-center gap-3 border-t border-blush-200 pt-6">
            <button
              type="submit"
              disabled={saving || hasValidationErrors}
              className="rounded-full bg-blush-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blush-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save services"}
            </button>
            <p className="text-xs text-charcoal/50">
              Square booking prices are separate — update Square when you change
              real pricing.
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
