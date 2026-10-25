"use client";

import { useEffect } from "react";
import { getPromoFont, promoFontStylesheetUrl } from "@/lib/promo-font-options";

const PROMO_FONTS_LINK_ID = "promo-google-fonts";

export function usePromoFontsLoader(fontId: string) {
  useEffect(() => {
    const href = promoFontStylesheetUrl(getPromoFont(fontId));
    let link = document.getElementById(
      PROMO_FONTS_LINK_ID,
    ) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.id = PROMO_FONTS_LINK_ID;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    if (link.href !== href) {
      link.href = href;
    }
  }, [fontId]);
}
