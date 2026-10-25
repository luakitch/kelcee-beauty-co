"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSaleServicesContext } from "@/components/SaleServicesProvider";
import { getServicePriceDisplay } from "@/lib/service-pricing";
import type { CatalogService } from "@/lib/catalog-service";

const BANNER_HEIGHT_CLASS = "h-9";

function SaleBannerItem({ service }: { service: CatalogService }) {
  const { displayPrice, compareAtPrice } = getServicePriceDisplay({
    priceText: service.priceText,
    isOnSale: true,
    salePriceText: service.salePriceText,
  });

  return (
    <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-charcoal">
      <span className="font-display text-sm font-semibold leading-none">
        {service.name}
      </span>
      <span className="inline-flex items-center gap-1.5 text-xs">
        {compareAtPrice && (
          <span className="text-charcoal/45 line-through">{compareAtPrice}</span>
        )}
        <span className="font-bold text-rose-800">{displayPrice}</span>
      </span>
    </span>
  );
}

export function SalesTopBanner() {
  const { saleServices, loaded, hasSales } = useSaleServicesContext();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [useMarquee, setUseMarquee] = useState(false);

  useEffect(() => {
    if (!loaded || !hasSales) {
      return;
    }

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) {
      return;
    }

    const measure = () => {
      const contentWidth = track.classList.contains("sale-marquee-track")
        ? track.scrollWidth / 2
        : track.scrollWidth;
      setUseMarquee(contentWidth > viewport.clientWidth + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);

    return () => observer.disconnect();
  }, [loaded, hasSales, saleServices]);

  if (!loaded || !hasSales) {
    return null;
  }

  const items = useMarquee
    ? [...saleServices, ...saleServices]
    : saleServices;

  return (
    <Link
      href="/services#sales"
      className={`sticky top-0 z-[60] flex ${BANNER_HEIGHT_CLASS} items-center gap-3 border-b border-rose-200/70 bg-gradient-to-r from-rose-100/95 via-blush-50 to-rose-100/95 px-3 transition hover:from-rose-200/85 hover:to-rose-200/85 sm:px-4`}
      aria-label={`${saleServices.length} service${saleServices.length === 1 ? "" : "s"} on sale — view deals`}
    >
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-700">
        Sale
      </span>

      <div
        ref={viewportRef}
        className="flex min-w-0 flex-1 justify-center overflow-hidden"
      >
        <div
          ref={trackRef}
          className={`inline-flex items-center gap-4 ${
            useMarquee ? "sale-marquee-track w-max" : "w-max max-w-full"
          }`}
        >
          {items.map((service, index) => (
            <Fragment key={`${service.name}-${index}`}>
              {index > 0 && (
                <span aria-hidden className="shrink-0 text-rose-300/80">
                  ·
                </span>
              )}
              <SaleBannerItem service={service} />
            </Fragment>
          ))}
        </div>
      </div>

      <span className="hidden shrink-0 text-[10px] font-semibold text-rose-700 sm:inline">
        View deals →
      </span>
    </Link>
  );
}

export const salesTopBannerHeightClass = BANNER_HEIGHT_CLASS;
