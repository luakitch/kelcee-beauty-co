"use client";

import { BowAccent, BowDivider } from "@/components/BowAccent";
import { PromoListScaleFill } from "@/components/admin/promos/PromoListScaleFill";
import type { CatalogService } from "@/lib/catalog-service";
import { getServicePriceDisplay } from "@/lib/service-pricing";
import { instagramHandleFromUrl } from "@/lib/instagram-handle";
import {
  getPromoListLayout,
  type PromoListDensity,
} from "@/lib/promo-list-layout";
import { getPromoFont } from "@/lib/promo-font-options";
import { siteConfig } from "@/lib/site-config";

export type PromoFormat = "post" | "story";

const DIMENSIONS: Record<PromoFormat, { width: number; height: number }> = {
  post: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
};

export type SalePromoArtboardProps = {
  format: PromoFormat;
  services: CatalogService[];
  fontId: string;
  className?: string;
};

const DENSITY_STYLES: Record<
  PromoListDensity,
  {
    rowPad: string;
    name: string;
    duration: string;
    compare: string;
    price: string;
  }
> = {
  normal: {
    rowPad: "py-5",
    name: "text-[2rem]",
    duration: "text-lg",
    compare: "text-xl",
    price: "text-[2.25rem]",
  },
  compact: {
    rowPad: "py-3.5",
    name: "text-[1.65rem]",
    duration: "text-base",
    compare: "text-lg",
    price: "text-[1.9rem]",
  },
  dense: {
    rowPad: "py-2.5",
    name: "text-[1.35rem]",
    duration: "text-sm",
    compare: "text-base",
    price: "text-[1.5rem]",
  },
  ultra: {
    rowPad: "py-2",
    name: "text-[1.15rem] leading-tight",
    duration: "text-xs",
    compare: "text-sm",
    price: "text-[1.25rem]",
  },
};

function PromoSaleRow({
  service,
  density,
  hideDuration,
  twoColumn,
}: {
  service: CatalogService;
  density: PromoListDensity;
  hideDuration: boolean;
  twoColumn: boolean;
}) {
  const { displayPrice, compareAtPrice } = getServicePriceDisplay({
    priceText: service.priceText,
    isOnSale: true,
    salePriceText: service.salePriceText,
  });
  const styles = DENSITY_STYLES[density];

  return (
    <div
      className={`flex ${styles.rowPad} ${
        twoColumn
          ? "items-center justify-between gap-3"
          : "items-center justify-between gap-4"
      }`}
    >
      <div className="min-w-0 flex-1 text-left">
        <p
          className={`font-semibold leading-tight text-charcoal ${styles.name}`}
        >
          {service.name}
        </p>
        {!hideDuration && (
          <p className={`mt-0.5 text-charcoal/55 ${styles.duration}`}>
            {service.duration}
          </p>
        )}
      </div>
      <div className="shrink-0 text-right">
        {compareAtPrice && (
          <p
            className={`font-medium text-charcoal/40 line-through ${styles.compare}`}
          >
            {compareAtPrice}
          </p>
        )}
        <p className={`font-bold text-rose-800 ${styles.price}`}>
          {displayPrice}
        </p>
      </div>
    </div>
  );
}

function HeroSaleBlock({ service }: { service: CatalogService }) {
  const { displayPrice, compareAtPrice } = getServicePriceDisplay({
    priceText: service.priceText,
    isOnSale: true,
    salePriceText: service.salePriceText,
  });

  return (
    <div className="text-center">
      <p className="text-xl font-semibold uppercase tracking-[0.25em] text-rose-600">
        {service.category}
      </p>
      <h2 className="mt-3 text-[2.75rem] font-semibold leading-[1.1] text-charcoal">
        {service.name}
      </h2>
      <p className="mx-auto mt-4 line-clamp-4 max-w-[28rem] text-xl leading-relaxed text-charcoal/65">
        {service.description}
      </p>
      <div className="mt-6 inline-flex flex-col items-center gap-2">
        {compareAtPrice && (
          <span className="text-2xl font-medium text-charcoal/40 line-through">
            {compareAtPrice}
          </span>
        )}
        <span className="rounded-full bg-gradient-to-r from-rose-100 via-blush-100 to-rose-100 px-10 py-4 text-4xl font-bold text-rose-900 ring-2 ring-rose-200/90">
          {displayPrice}
        </span>
        <span className="mt-2 text-lg text-charcoal/50">
          {service.duration}
        </span>
      </div>
    </div>
  );
}

export function getSalePromoDimensions(format: PromoFormat) {
  return DIMENSIONS[format];
}

function sortForPromo(services: CatalogService[]) {
  return [...services].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return a.name.localeCompare(b.name);
  });
}

function pairRows(services: CatalogService[]): CatalogService[][] {
  const rows: CatalogService[][] = [];
  for (let index = 0; index < services.length; index += 2) {
    rows.push(services.slice(index, index + 2));
  }
  return rows;
}

function PromoSaleList({
  services,
  listLayout,
  twoColumn,
}: {
  services: CatalogService[];
  listLayout: ReturnType<typeof getPromoListLayout>;
  twoColumn: boolean;
}) {
  const boxClass =
    "rounded-3xl bg-white/55 ring-1 ring-white/80 backdrop-blur-sm";

  if (twoColumn) {
    return (
      <div className={`${boxClass} px-5 py-1`}>
        {pairRows(services).map((row) => (
          <div
            key={row.map((service) => service.name).join("-")}
            className="grid grid-cols-2 border-b border-rose-200/50"
          >
            <div className="border-r border-rose-300/75 px-4">
              <PromoSaleRow
                service={row[0]}
                density={listLayout.density}
                hideDuration={listLayout.hideDuration}
                twoColumn
              />
            </div>
            {row[1] ? (
              <div className="px-4">
                <PromoSaleRow
                  service={row[1]}
                  density={listLayout.density}
                  hideDuration={listLayout.hideDuration}
                  twoColumn
                />
              </div>
            ) : (
              <div aria-hidden className="min-h-full" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${boxClass} px-8 py-1`}>
      {services.map((service) => (
        <div
          key={service.name}
          className="border-b border-rose-200/50"
        >
          <PromoSaleRow
            service={service}
            density={listLayout.density}
            hideDuration={listLayout.hideDuration}
            twoColumn={false}
          />
        </div>
      ))}
    </div>
  );
}

export function SalePromoArtboard({
  format,
  services,
  fontId,
  className = "",
}: SalePromoArtboardProps) {
  const { width, height } = DIMENSIONS[format];
  const promoFont = getPromoFont(fontId);
  const handle = instagramHandleFromUrl(siteConfig.instagramUrl);
  const listServices = sortForPromo(services);
  const heroService = listServices.length === 1 ? listServices[0] : null;
  const isStory = format === "story";
  const saleCount = listServices.length;
  const listLayout = getPromoListLayout(saleCount, format);
  const twoColumn = listLayout.columns === 2;
  const compactHeader =
    listLayout.compactHeader ||
    (!isStory && saleCount >= 5) ||
    (isStory && saleCount >= 10);
  const logoSrc =
    typeof window !== "undefined"
      ? `${window.location.origin}${siteConfig.logo.src}`
      : siteConfig.logo.src;

  const logoSize = compactHeader ? (isStory ? 96 : 72) : isStory ? 120 : 96;
  const titleSize = compactHeader
    ? isStory
      ? "text-[2.75rem]"
      : "text-[2rem]"
    : isStory
      ? "text-[3.25rem]"
      : "text-[2.5rem]";

  return (
    <div
      className={`relative overflow-hidden bg-cream text-charcoal ${className}`}
      style={{ width, height, fontFamily: promoFont.family }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(251, 207, 232, 0.55), transparent 60%), radial-gradient(ellipse 80% 50% at 100% 100%, rgba(244, 114, 182, 0.2), transparent 55%), linear-gradient(165deg, #fff9f5 0%, #fdf2f8 45%, #fff7ed 100%)",
        }}
      />

      <BowAccent
        size={isStory ? 140 : 120}
        className="pointer-events-none absolute -left-4 top-16 text-blush-300/50"
      />
      <BowAccent
        size={isStory ? 100 : 72}
        className="pointer-events-none absolute -right-2 bottom-6 rotate-12 text-rose-200/40"
      />
      {!compactHeader && (
        <BowAccent
          size={72}
          className="pointer-events-none absolute right-24 top-28 text-blush-200/40"
        />
      )}

      <div
        className={`relative grid h-full min-h-0 px-12 ${
          isStory
            ? "grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-y-8 py-16 pb-20"
            : "grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-y-5 py-12 pb-16"
        } ${compactHeader ? (isStory ? "gap-y-4 py-10 pb-12" : "gap-y-2 py-8 pb-12") : ""}`}
      >
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt=""
            width={logoSize}
            height={logoSize}
            className="rounded-full object-cover ring-4 ring-white/90 shadow-lg shadow-blush-300/30"
          />
          <p
            className={`mt-3 font-semibold leading-snug tracking-wide text-charcoal ${
              compactHeader ? "text-[1.35rem]" : isStory ? "text-[2rem]" : "text-[1.65rem]"
            }`}
          >
            {siteConfig.name}
          </p>
          {!compactHeader && (
            <p className="mt-1 text-base text-charcoal/55">
              {siteConfig.tagline}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="inline-flex items-center gap-3 rounded-full bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.28em] text-rose-700 ring-1 ring-rose-200/90 shadow-sm">
            <span aria-hidden>✦</span>
            Limited time sale
            <span aria-hidden>✦</span>
          </p>
          <h1
            className={`mt-3 font-semibold leading-tight text-charcoal ${titleSize}`}
          >
            {heroService ? "Special offer" : "Current sales"}
          </h1>
          {!compactHeader && <BowDivider className="mt-4 scale-110" />}
        </div>

        <div className="min-h-0">
          {heroService ? (
            <div className="flex h-full min-h-0 items-center justify-center">
              <HeroSaleBlock service={heroService} />
            </div>
          ) : (
            <PromoListScaleFill
              fitKey={`${format}-${saleCount}-${listLayout.density}-${twoColumn}`}
            >
              <PromoSaleList
                services={listServices}
                listLayout={listLayout}
                twoColumn={twoColumn}
              />
            </PromoListScaleFill>
          )}
        </div>

        <footer
          className={`shrink-0 border-t border-rose-200/40 text-center ${
            compactHeader ? "pt-3 pb-1" : "pt-6"
          }`}
        >
          <p
            className={`font-semibold leading-snug text-blush-700 ${
              compactHeader ? "text-[1.35rem]" : "text-[1.75rem]"
            }`}
          >
            Book your spot
          </p>
          <p
            className={`mt-1 font-semibold leading-snug text-charcoal ${
              compactHeader ? "text-[1.15rem]" : "text-[1.5rem]"
            }`}
          >
            {siteConfig.name}
          </p>
          <p className="mt-1 text-lg text-charcoal/60">
            Link in bio · {siteConfig.location}
          </p>
          <p className="mt-1 text-xl font-semibold text-charcoal">
            @{handle}
          </p>
        </footer>
      </div>
    </div>
  );
}
