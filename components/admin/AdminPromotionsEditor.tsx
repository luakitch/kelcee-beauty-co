"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  getSalePromoDimensions,
  SalePromoArtboard,
  type PromoFormat,
} from "@/components/admin/promos/SalePromoArtboard";
import { useAdminCatalogServices } from "@/components/admin/AdminCatalogServicesContext";
import {
  getPromoListLayout,
  PROMO_MAX_SALES,
} from "@/lib/promo-list-layout";
import { PromoServiceCheckbox } from "@/components/admin/PromoServiceCheckbox";
import { getServicePriceDisplay } from "@/lib/service-pricing";

type SalesSelectionMode = "all" | "pick";

type AdminPromotionsEditorProps = {
  isActive: boolean;
};

function saleNamesSet(services: { name: string }[]) {
  return new Set(services.map((service) => service.name));
}

export function AdminPromotionsEditor({ isActive }: AdminPromotionsEditorProps) {
  const {
    catalogForPromo,
    refreshSavedServices,
    refreshing,
    hasLiveDrafts,
  } = useAdminCatalogServices();
  const loading = refreshing && catalogForPromo.length === 0 && !hasLiveDrafts;
  const [format, setFormat] = useState<PromoFormat>("post");
  const [selectionMode, setSelectionMode] =
    useState<SalesSelectionMode>("all");
  const [pickedNames, setPickedNames] = useState<Set<string>>(
    () => new Set(),
  );
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.36);

  useEffect(() => {
    if (isActive) {
      void refreshSavedServices();
    }
  }, [isActive, refreshSavedServices]);

  const saleServices = useMemo(() => {
    return catalogForPromo
      .filter((service) => service.isOnSale && service.salePriceText?.trim())
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return a.name.localeCompare(b.name);
      });
  }, [catalogForPromo]);

  useEffect(() => {
    const validNames = saleNamesSet(saleServices);
    setPickedNames((previous) => {
      const kept = new Set(
        [...previous].filter((name) => validNames.has(name)),
      );
      if (kept.size === 0 && validNames.size > 0) {
        return validNames;
      }
      return kept;
    });
  }, [saleServices]);

  const promoServices = useMemo(() => {
    const source =
      selectionMode === "all"
        ? saleServices
        : saleServices.filter((service) => pickedNames.has(service.name));
    return source.slice(0, PROMO_MAX_SALES);
  }, [selectionMode, saleServices, pickedNames]);

  const listLayoutHint = useMemo(
    () => getPromoListLayout(promoServices.length, format),
    [promoServices.length, format],
  );

  useEffect(() => {
    const wrap = previewWrapRef.current;
    if (!wrap) {
      return;
    }

    const { width: artW } = getSalePromoDimensions(format);

    const updateScale = () => {
      const available = wrap.clientWidth - 8;
      setPreviewScale(Math.min(1, available / artW));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [format]);

  function togglePicked(name: string) {
    setPickedNames((previous) => {
      const next = new Set(previous);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  function selectAllPicked() {
    setPickedNames(saleNamesSet(saleServices));
  }

  async function handleDownload() {
    const node = exportRef.current;
    if (!node) {
      return;
    }

    setDownloading(true);
    setDownloadError(null);

    try {
      await document.fonts.ready;
      const { width, height } = getSalePromoDimensions(format);
      const dataUrl = await toPng(node, {
        width,
        height,
        pixelRatio: 1,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `kelcee-sale-${format}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      setDownloadError(
        err instanceof Error ? err.message : "Could not create image.",
      );
    } finally {
      setDownloading(false);
    }
  }

  const pickCount = pickedNames.size;

  return (
    <section className="rounded-2xl border border-blush-200 bg-white/80 p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-charcoal">
            Instagram promos
          </h2>
          <p className="mt-2 text-sm text-charcoal/70">
            Create on-brand sale graphics for posts and stories. Turn on sales
            under Services, then download and share to Instagram.
          </p>
        </div>
      </div>

      {hasLiveDrafts && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2 text-xs text-amber-950">
          Preview includes unsaved service edits from the Services tab.
        </p>
      )}

      {loading ? (
        <div className="mt-8 aspect-square max-w-md animate-pulse rounded-3xl bg-blush-100" />
      ) : saleServices.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-blush-200 bg-blush-50/50 px-6 py-12 text-center">
          <p className="font-display text-xl font-semibold text-charcoal">
            No active sales yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/65">
            Mark services on sale in the Services tab — they&apos;ll show up
            here automatically for promo graphics.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
          <div className="space-y-6">
            <p className="rounded-xl bg-blush-50/80 px-4 py-3 text-sm text-charcoal/70">
              <span className="font-semibold text-charcoal">
                {promoServices.length} sale
                {promoServices.length === 1 ? "" : "s"}
              </span>{" "}
              on this graphic
              {promoServices.length === 1 ? (
                <span className="mt-1 block text-charcoal/55">
                  Single-service hero layout.
                </span>
              ) : null}
              {promoServices.length > PROMO_MAX_SALES ? (
                <span className="mt-1 block text-rose-700">
                  Only the first {PROMO_MAX_SALES} fit on one image — choose
                  fewer services or make another download.
                </span>
              ) : listLayoutHint.columns === 2 ? (
                <span className="mt-1 block text-charcoal/55">
                  Using two columns so every sale fits on a{" "}
                  {format === "post" ? "feed post" : "story"}.
                </span>
              ) : null}
            </p>

            <fieldset className="space-y-3">
              <legend className="text-xs font-medium uppercase tracking-wide text-charcoal/50">
                Format
              </legend>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "post", label: "Feed post", sub: "1080 × 1080" },
                    { id: "story", label: "Story", sub: "1080 × 1920" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFormat(option.id)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      format === option.id
                        ? "border-blush-400 bg-blush-50 ring-1 ring-blush-200"
                        : "border-blush-200 bg-white hover:border-blush-300"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-charcoal">
                      {option.label}
                    </span>
                    <span className="text-xs text-charcoal/50">{option.sub}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-xs font-medium uppercase tracking-wide text-charcoal/50">
                Sales on this graphic
              </legend>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectionMode("all")}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    selectionMode === "all"
                      ? "bg-blush-500 text-white"
                      : "border border-blush-300 text-charcoal hover:bg-blush-50"
                  }`}
                >
                  All sales ({saleServices.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectionMode("pick");
                    if (pickedNames.size === 0) {
                      selectAllPicked();
                    }
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    selectionMode === "pick"
                      ? "bg-blush-500 text-white"
                      : "border border-blush-300 text-charcoal hover:bg-blush-50"
                  }`}
                >
                  Choose services
                  {selectionMode === "pick" ? ` (${pickCount})` : ""}
                </button>
              </div>

              {selectionMode === "pick" && (
                <div className="rounded-xl border border-blush-200 bg-white/90 p-3">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-charcoal/55">
                      Check each sale to include. One selected uses the hero
                      layout.
                    </p>
                    <button
                      type="button"
                      onClick={selectAllPicked}
                      className="text-xs font-semibold text-blush-600 hover:text-blush-700"
                    >
                      Select all
                    </button>
                  </div>
                  <ul className="max-h-64 space-y-1 overflow-y-auto">
                    {saleServices.map((service) => {
                      const checked = pickedNames.has(service.name);
                      const { displayPrice } = getServicePriceDisplay({
                        priceText: service.priceText,
                        isOnSale: true,
                        salePriceText: service.salePriceText,
                      });

                      return (
                        <li key={service.name}>
                          <PromoServiceCheckbox
                            id={`promo-pick-${service.name.replace(/\s+/g, "-")}`}
                            checked={checked}
                            onChange={() => togglePicked(service.name)}
                            label={service.name}
                            trailing={
                              <span className="shrink-0 text-sm font-semibold text-rose-800">
                                {displayPrice}
                              </span>
                            }
                          />
                        </li>
                      );
                    })}
                  </ul>
                  {pickCount === 0 && (
                    <p className="mt-2 text-xs text-rose-700">
                      Select at least one service to preview or download.
                    </p>
                  )}
                </div>
              )}
            </fieldset>

            {downloadError && (
              <p className="text-sm text-rose-700">{downloadError}</p>
            )}

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading || promoServices.length === 0}
              className="w-full cursor-pointer rounded-full bg-blush-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-blush-300/40 transition-all duration-200 hover:scale-[1.01] hover:bg-blush-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
            >
              {downloading ? "Creating image…" : "Download PNG for Instagram"}
            </button>
          </div>

          <div className="lg:sticky lg:top-24">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-charcoal/45 lg:text-left">
              Preview
            </p>
            <div
              ref={previewWrapRef}
              className="mx-auto flex justify-center overflow-hidden rounded-[1.75rem] border border-blush-200 bg-gradient-to-b from-blush-50/80 to-cream p-3 shadow-inner"
            >
              {promoServices.length === 0 ? (
                <div className="flex aspect-square w-full max-w-sm items-center justify-center px-6 text-center text-sm text-charcoal/55">
                  Choose at least one sale to see a preview.
                </div>
              ) : (
                <div
                  style={{
                    width: Math.ceil(
                      getSalePromoDimensions(format).width * previewScale,
                    ),
                    height: Math.ceil(
                      getSalePromoDimensions(format).height * previewScale,
                    ),
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <SalePromoArtboard format={format} services={promoServices} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {promoServices.length > 0 && (
        <div
          className="pointer-events-none fixed top-0 -left-[10000px]"
          aria-hidden
        >
          <div ref={exportRef}>
            <SalePromoArtboard format={format} services={promoServices} />
          </div>
        </div>
      )}
    </section>
  );
}
