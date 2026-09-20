export const GALLERY_BUCKETS = {
  production: "gallery",
  development: "gallery-dev",
} as const;

export type GalleryBucketName =
  (typeof GALLERY_BUCKETS)[keyof typeof GALLERY_BUCKETS];

export function getGalleryBucket(): GalleryBucketName {
  const configured = process.env.NEXT_PUBLIC_SUPABASE_GALLERY_BUCKET?.trim();
  if (configured === GALLERY_BUCKETS.production) {
    return GALLERY_BUCKETS.production;
  }
  if (configured === GALLERY_BUCKETS.development) {
    return GALLERY_BUCKETS.development;
  }

  return process.env.NODE_ENV === "development"
    ? GALLERY_BUCKETS.development
    : GALLERY_BUCKETS.production;
}

export function isGalleryBucket(bucket: string): bucket is GalleryBucketName {
  return (
    bucket === GALLERY_BUCKETS.production ||
    bucket === GALLERY_BUCKETS.development
  );
}
