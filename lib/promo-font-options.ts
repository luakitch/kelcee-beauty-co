export type PromoFontCategory = "Serif" | "Sans" | "Script";

export type PromoFontOption = {
  id: string;
  label: string;
  category: PromoFontCategory;
  /** Value for CSS `font-family` */
  family: string;
  /** Google Fonts CSS2 family parameter */
  googleSpec: string;
};

export const DEFAULT_PROMO_FONT_ID = "cormorant-garamond";

export const PROMO_FONT_OPTIONS: PromoFontOption[] = [
  {
    id: "cormorant-garamond",
    label: "Cormorant Garamond",
    category: "Serif",
    family: '"Cormorant Garamond", serif',
    googleSpec: "Cormorant+Garamond:wght@400;600;700",
  },
  {
    id: "playfair-display",
    label: "Playfair Display",
    category: "Serif",
    family: '"Playfair Display", serif',
    googleSpec: "Playfair+Display:wght@400;600;700",
  },
  {
    id: "lora",
    label: "Lora",
    category: "Serif",
    family: "Lora, serif",
    googleSpec: "Lora:wght@400;600;700",
  },
  {
    id: "libre-baskerville",
    label: "Libre Baskerville",
    category: "Serif",
    family: '"Libre Baskerville", serif',
    googleSpec: "Libre+Baskerville:wght@400;700",
  },
  {
    id: "crimson-pro",
    label: "Crimson Pro",
    category: "Serif",
    family: '"Crimson Pro", serif',
    googleSpec: "Crimson+Pro:wght@400;600;700",
  },
  {
    id: "petrona",
    label: "Petrona",
    category: "Serif",
    family: "Petrona, serif",
    googleSpec: "Petrona:wght@400;600;700",
  },
  {
    id: "nunito",
    label: "Nunito",
    category: "Sans",
    family: "Nunito, sans-serif",
    googleSpec: "Nunito:wght@400;600;700",
  },
  {
    id: "montserrat",
    label: "Montserrat",
    category: "Sans",
    family: "Montserrat, sans-serif",
    googleSpec: "Montserrat:wght@400;600;700",
  },
  {
    id: "raleway",
    label: "Raleway",
    category: "Sans",
    family: "Raleway, sans-serif",
    googleSpec: "Raleway:wght@400;600;700",
  },
  {
    id: "poppins",
    label: "Poppins",
    category: "Sans",
    family: "Poppins, sans-serif",
    googleSpec: "Poppins:wght@400;600;700",
  },
  {
    id: "quicksand",
    label: "Quicksand",
    category: "Sans",
    family: "Quicksand, sans-serif",
    googleSpec: "Quicksand:wght@400;600;700",
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    category: "Sans",
    family: '"DM Sans", sans-serif',
    googleSpec: "DM+Sans:wght@400;600;700",
  },
  {
    id: "josefin-sans",
    label: "Josefin Sans",
    category: "Sans",
    family: '"Josefin Sans", sans-serif',
    googleSpec: "Josefin+Sans:wght@400;600;700",
  },
  {
    id: "great-vibes",
    label: "Great Vibes",
    category: "Script",
    family: '"Great Vibes", cursive',
    googleSpec: "Great+Vibes",
  },
  {
    id: "parisienne",
    label: "Parisienne",
    category: "Script",
    family: "Parisienne, cursive",
    googleSpec: "Parisienne",
  },
];

export function getPromoFont(fontId: string): PromoFontOption {
  return (
    PROMO_FONT_OPTIONS.find((font) => font.id === fontId) ??
    PROMO_FONT_OPTIONS[0]
  );
}

export function buildPromoFontsStylesheetUrl(): string {
  const families = PROMO_FONT_OPTIONS.map((font) => font.googleSpec).join(
    "&family=",
  );
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}

export function promoFontStylesheetUrl(font: PromoFontOption): string {
  return `https://fonts.googleapis.com/css2?family=${font.googleSpec}&display=swap`;
}

const embeddedFontCssCache = new Map<string, string>();

async function blobUrlToDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Could not read font file: ${url}`));
    reader.readAsDataURL(blob);
  });
}

/** Inlined @font-face CSS for html-to-image (avoids cross-origin stylesheet reads). */
export async function fetchEmbeddedPromoFontCss(
  font: PromoFontOption,
): Promise<string> {
  const cached = embeddedFontCssCache.get(font.id);
  if (cached) {
    return cached;
  }

  const stylesheetUrl = promoFontStylesheetUrl(font);
  let css = await fetch(stylesheetUrl).then((response) => response.text());

  const fontUrls = [
    ...css.matchAll(/url\(\s*(['"]?)(https:[^'")]+)\1\s*\)/g),
  ].map((match) => match[2]);

  for (const fontUrl of fontUrls) {
    const dataUrl = await blobUrlToDataUrl(fontUrl);
    css = css.replaceAll(fontUrl, dataUrl);
  }

  embeddedFontCssCache.set(font.id, css);
  return css;
}

export async function ensurePromoFontLoaded(font: PromoFontOption): Promise<void> {
  await document.fonts.ready;
  const loads = [
    document.fonts.load(`400 24px ${font.family}`),
    document.fonts.load(`600 24px ${font.family}`),
    document.fonts.load(`700 24px ${font.family}`),
  ];
  await Promise.allSettled(loads);
}
