import type { PromoFormat } from "@/components/admin/promos/SalePromoArtboard";

export type PromoListDensity = "normal" | "compact" | "dense" | "ultra";

export type PromoListLayout = {
  columns: 1 | 2;
  density: PromoListDensity;
  hideDuration: boolean;
  compactHeader: boolean;
};

/** Vertical space (px) available for the sale list inside the artboard. */
const LIST_ZONE_HEIGHT: Record<
  PromoFormat,
  { standard: number; compactHeader: number }
> = {
  post: { standard: 480, compactHeader: 540 },
  story: { standard: 1050, compactHeader: 1120 },
};

function rowHeightPx(
  density: PromoListDensity,
  columns: 1 | 2,
  hideDuration: boolean,
): number {
  const table: Record<
    PromoListDensity,
    { single: number; singleNoDur: number; twoCol: number }
  > = {
    normal: { single: 96, singleNoDur: 72, twoCol: 88 },
    compact: { single: 64, singleNoDur: 48, twoCol: 60 },
    dense: { single: 50, singleNoDur: 38, twoCol: 44 },
    ultra: { single: 38, singleNoDur: 30, twoCol: 34 },
  };
  const row = table[density];
  if (columns === 2) {
    return row.twoCol;
  }
  return hideDuration ? row.singleNoDur : row.single;
}

function listBlockHeight(
  itemCount: number,
  columns: 1 | 2,
  density: PromoListDensity,
  hideDuration: boolean,
): number {
  const rows = columns === 2 ? Math.ceil(itemCount / 2) : itemCount;
  const pad = columns === 2 ? 16 : 24;
  return rows * rowHeightPx(density, columns, hideDuration) + pad;
}

function layoutFits(
  itemCount: number,
  format: PromoFormat,
  layout: PromoListLayout,
): boolean {
  const zone = LIST_ZONE_HEIGHT[format];
  const maxHeight = layout.compactHeader
    ? zone.compactHeader
    : zone.standard;
  return (
    listBlockHeight(
      itemCount,
      layout.columns,
      layout.density,
      layout.hideDuration,
    ) <= maxHeight
  );
}

function candidatesForCount(
  itemCount: number,
  format: PromoFormat,
): PromoListLayout[] {
  const L = (
    columns: 1 | 2,
    density: PromoListDensity,
    hideDuration: boolean,
    compactHeader: boolean,
  ): PromoListLayout => ({
    columns,
    density,
    hideDuration,
    compactHeader,
  });

  if (format === "story") {
    if (itemCount <= 1) {
      return [L(1, "normal", false, false)];
    }

    if (itemCount <= 4) {
      return [
        L(2, "normal", false, false),
        L(2, "normal", true, false),
        L(2, "compact", false, false),
        L(2, "compact", true, false),
        L(1, "normal", false, false),
        L(1, "compact", false, false),
      ];
    }

    return [
      L(2, "normal", false, false),
      L(2, "normal", false, true),
      L(2, "normal", true, true),
      L(2, "compact", false, true),
      L(2, "compact", true, true),
      L(2, "dense", false, true),
      L(2, "dense", true, true),
      L(1, "compact", true, true),
      L(2, "ultra", true, true),
    ];
  }

  if (itemCount <= 4) {
    return [
      L(1, "normal", false, false),
      L(1, "compact", false, false),
      L(1, "compact", false, true),
      L(1, "compact", true, true),
      L(2, "compact", true, true),
    ];
  }

  if (itemCount <= 6) {
    return [
      L(1, "compact", false, true),
      L(1, "compact", true, true),
      L(2, "compact", false, true),
      L(2, "compact", true, true),
      L(2, "dense", true, true),
    ];
  }

  return [
    L(2, "normal", false, true),
    L(2, "normal", true, true),
    L(2, "compact", false, true),
    L(2, "compact", true, true),
    L(2, "dense", false, true),
    L(2, "dense", true, true),
    L(1, "compact", true, true),
    L(1, "dense", true, true),
    L(2, "ultra", true, true),
  ];
}

export function getPromoListLayout(
  itemCount: number,
  format: PromoFormat,
): PromoListLayout {
  if (itemCount <= 0) {
    return {
      columns: 1,
      density: "normal",
      hideDuration: false,
      compactHeader: false,
    };
  }

  for (const layout of candidatesForCount(itemCount, format)) {
    if (layoutFits(itemCount, format, layout)) {
      return layout;
    }
  }

  return {
    columns: 2,
    density: "ultra",
    hideDuration: true,
    compactHeader: true,
  };
}

export const PROMO_MAX_SALES = 16;
