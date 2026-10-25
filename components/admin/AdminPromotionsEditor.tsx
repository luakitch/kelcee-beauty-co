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
import { usePromoFontsLoader } from "@/components/admin/promos/usePromoFontsLoader";
import {
  DEFAULT_PROMO_FONT_ID,
  ensurePromoFontLoaded,
  fetchEmbeddedPromoFontCss,
  getPromoFont,
  PROMO_FONT_OPTIONS,
  type PromoFontCategory,
} from "@/lib/promo-font-options";
import { getServicePriceDisplay } from "@/lib/service-pricing";

type SalesSelectionMode = "all" | "pick";

type AdminPromotionsEditorProps = {
  isActive: boolean;
};

function saleNamesSet(services: { name: string }[]) {
  return new Set(services.map((service) => service.name));
}

export function AdminPromotionsEditor({ isActive }: AdminPromotionsEditorProps) {
  const { savedServices, refreshSavedServices, refreshing } =
    useAdminCatalogServices();
  const loading = refreshing && savedServices.length === 0;
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
  const [fontId, setFontId] = useState(DEFAULT_PROMO_FONT_ID);

  usePromoFontsLoader(fontId);

  useEffect(() => {
    if (isActive) {
      void refreshSavedServices();
    }
  }, [isActive, refreshSavedServices]);

  const saleServices = useMemo(() => {
    return savedServices
      .filter((service) => service.isOnSale && service.salePriceText?.trim())
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return a.name.localeCompare(b.name);
      });
  }, [savedServices]);

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
      const font = getPromoFont(fontId);
      await ensurePromoFontLoaded(font);
      const fontEmbedCSS = await fetchEmbeddedPromoFontCss(font);
      const { width, height } = getSalePromoDimensions(format);
      const dataUrl = await toPng(node, {
        width,
        height,
        pixelRatio: 1,
        cacheBust: true,
        fontEmbedCSS,
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
  const activeFont = getPromoFont(fontId);
  const showMobileDownloadBar =
    !loading && saleServices.length > 0 && promoServices.length > 0;

  return (
    <section
      className={`rounded-2xl border border-blush-200 bg-white/80 p-4 shadow-sm sm:p-6 ${
        showMobileDownloadBar ? "pb-24 md:pb-6" : ""
      }`}
    >
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
        <div className="mt-6 flex flex-col gap-6 md:mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start lg:gap-8">
          <div className="order-2 min-w-0 space-y-5 lg:order-1 lg:space-y-6">
            <p className="rounded-xl bg-blush-50/80 px-3 py-2.5 text-sm text-charcoal/70 sm:px-4 sm:py-3">
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
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
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

            <fieldset className="space-y-3">
              <legend className="text-xs font-medium uppercase tracking-wide text-charcoal/50">
                Font
              </legend>
              <p className="hidden text-xs text-charcoal/55 md:block">
                Applies to the whole graphic — preview updates as you choose.
              </p>

              <label className="block md:hidden">
                <span className="sr-only">Font for this graphic</span>
                <select
                  value={fontId}
                  onChange={(event) => setFontId(event.target.value)}
                  className="w-full rounded-xl border border-blush-200 bg-white px-3 py-3 text-base font-semibold text-charcoal shadow-sm focus:border-blush-400 focus:outline-none focus:ring-2 focus:ring-blush-200"
                  style={{ fontFamily: activeFont.family }}
                >
                  {(
                    ["Serif", "Sans", "Script"] as PromoFontCategory[]
                  ).map((category) => {
                    const fonts = PROMO_FONT_OPTIONS.filter(
                      (font) => font.category === category,
                    );
                    if (fonts.length === 0) {
                      return null;
                    }

                    return (
                      <optgroup key={category} label={category}>
                        {fonts.map((font) => (
                          <option
                            key={font.id}
                            value={font.id}
                            style={{ fontFamily: font.family }}
                          >
                            {font.label}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </label>

              <details className="group rounded-xl border border-blush-200 bg-white/90 md:hidden">
                <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-blush-600 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="inline-flex items-center gap-1">
                    Browse all fonts with samples
                    <span
                      aria-hidden
                      className="text-charcoal/40 transition group-open:rotate-180"
                    >
                      ▾
                    </span>
                  </span>
                </summary>
                <div className="max-h-56 space-y-3 overflow-y-auto border-t border-blush-100 px-3 py-3">
                  {(
                    ["Serif", "Sans", "Script"] as PromoFontCategory[]
                  ).map((category) => {
                    const fonts = PROMO_FONT_OPTIONS.filter(
                      (font) => font.category === category,
                    );
                    if (fonts.length === 0) {
                      return null;
                    }

                    return (
                      <div key={category} className="space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-charcoal/45">
                          {category}
                        </p>
                        <ul className="space-y-1">
                          {fonts.map((font) => {
                            const selected = fontId === font.id;
                            return (
                              <li key={font.id}>
                                <button
                                  type="button"
                                  onClick={() => setFontId(font.id)}
                                  className={`w-full rounded-lg border px-2.5 py-2 text-left text-sm transition ${
                                    selected
                                      ? "border-blush-400 bg-blush-50 ring-1 ring-blush-200"
                                      : "border-transparent hover:border-blush-200 hover:bg-blush-50/50"
                                  }`}
                                  style={{ fontFamily: font.family }}
                                >
                                  {font.label}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </details>

              <div className="hidden space-y-4 md:block">
                {(
                  ["Serif", "Sans", "Script"] as PromoFontCategory[]
                ).map((category) => {
                  const fonts = PROMO_FONT_OPTIONS.filter(
                    (font) => font.category === category,
                  );
                  if (fonts.length === 0) {
                    return null;
                  }

                  return (
                    <div key={category} className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-charcoal/45">
                        {category}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {fonts.map((font) => {
                          const selected = fontId === font.id;
                          return (
                            <button
                              key={font.id}
                              type="button"
                              onClick={() => setFontId(font.id)}
                              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                                selected
                                  ? "border-blush-400 bg-blush-50 ring-1 ring-blush-200"
                                  : "border-blush-200 bg-white hover:border-blush-300"
                              }`}
                              style={{ fontFamily: font.family }}
                            >
                              <span className="block text-base font-semibold text-charcoal">
                                {font.label}
                              </span>
                              <span className="mt-0.5 block text-sm text-charcoal/55">
                                Current sales · $45
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            {downloadError && (
              <p className="text-sm text-rose-700">{downloadError}</p>
            )}

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading || promoServices.length === 0}
              className="hidden w-full cursor-pointer rounded-full bg-blush-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-blush-300/40 transition-all duration-200 hover:scale-[1.01] hover:bg-blush-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex md:w-auto md:px-10"
            >
              {downloading ? "Creating image…" : "Download PNG for Instagram"}
            </button>
          </div>

          <div className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-24">
            <div className="mb-2 flex items-center justify-between gap-2 md:mb-3">
              <p className="text-xs font-medium uppercase tracking-wide text-charcoal/45">
                Preview
              </p>
              <p className="truncate text-xs text-charcoal/50 md:hidden">
                {format === "post" ? "Feed" : "Story"} · {activeFont.label}
              </p>
            </div>
            <div
              ref={previewWrapRef}
              className="mx-auto flex justify-center overflow-hidden rounded-2xl border border-blush-200 bg-gradient-to-b from-blush-50/80 to-cream p-2 shadow-inner sm:rounded-[1.75rem] sm:p-3"
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
                    <SalePromoArtboard
                      format={format}
                      services={promoServices}
                      fontId={fontId}
                    />
                  </div>
                </div>
              )}
            </div>

            {downloadError ? (
              <p className="mt-2 text-center text-sm text-rose-700 md:hidden">
                {downloadError}
              </p>
            ) : null}
          </div>
        </div>
      )}

      {showMobileDownloadBar ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-blush-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="w-full cursor-pointer rounded-full bg-blush-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-blush-300/40 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading ? "Creating image…" : "Download PNG for Instagram"}
          </button>
        </div>
      ) : null}

      {promoServices.length > 0 && (
        <div
          className="pointer-events-none fixed top-0 -left-[10000px]"
          aria-hidden
        >
          <div ref={exportRef}>
            <SalePromoArtboard
              format={format}
              services={promoServices}
              fontId={fontId}
            />
          </div>
        </div>
      )}
    </section>
  );
}
