"use client";

import { useEffect, useState } from "react";
import {
  fetchGalleryImages,
  getGalleryImageUrl,
  type GalleryImage,
} from "@/lib/supabase/client";

type GalleryGridProps = {
  limit?: number;
  showCaptions?: boolean;
};

const PLACEHOLDER_COUNT = 6;

const placeholderGradients = [
  "from-blush-200 to-blush-300",
  "from-blush-100 to-rose-200",
  "from-rose-100 to-blush-200",
  "from-blush-200 to-rose-100",
  "from-rose-200 to-blush-300",
  "from-blush-100 to-blush-300",
];

export function GalleryGrid({ limit, showCaptions = true }: GalleryGridProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingPlaceholders, setUsingPlaceholders] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await fetchGalleryImages();
      if (cancelled) return;

      if (data.length === 0) {
        setUsingPlaceholders(true);
      } else {
        setImages(limit ? data.slice(0, limit) : data);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {Array.from({ length: limit ?? PLACEHOLDER_COUNT }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-2xl bg-blush-100"
          />
        ))}
      </div>
    );
  }

  if (usingPlaceholders) {
    const count = limit ?? PLACEHOLDER_COUNT;
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${placeholderGradients[i % placeholderGradients.length]} flex items-end p-4 shadow-sm`}
          >
            {showCaptions && (
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-charcoal/60 backdrop-blur-sm">
                Coming soon
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
      {images.map((image) => {
        const url = getGalleryImageUrl(image.storage_path, image.bucket_id);
        return (
          <figure
            key={image.id}
            className="group overflow-hidden rounded-2xl border border-blush-200/80 bg-white/70 shadow-sm transition hover:border-blush-300 hover:shadow-md"
          >
            <div className="aspect-[3/4] overflow-hidden bg-blush-50">
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={image.caption ?? "Kelcee Beauty Co. gallery photo"}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blush-100 text-sm text-charcoal/40">
                  Image unavailable
                </div>
              )}
            </div>
            {showCaptions && image.caption && (
              <figcaption className="border-t border-blush-200/70 bg-gradient-to-b from-white to-blush-50/80 px-5 py-4 text-center">
                <p className="font-display text-base font-medium leading-snug tracking-wide text-charcoal/90 sm:text-lg">
                  {image.caption}
                </p>
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
