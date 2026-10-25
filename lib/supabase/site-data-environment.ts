import {
  GALLERY_BUCKETS,
  getGalleryBucket,
} from "@/lib/supabase/gallery-bucket";

/** True when this build uses dev Supabase tables + gallery-dev storage. */
export function isDevelopmentDataSite(): boolean {
  return getGalleryBucket() === GALLERY_BUCKETS.development;
}

export function getGalleryImagesTable(): "gallery_images" | "gallery_images_dev" {
  return isDevelopmentDataSite() ? "gallery_images_dev" : "gallery_images";
}

export function getBusinessHoursTable():
  | "business_hours"
  | "business_hours_dev" {
  return isDevelopmentDataSite() ? "business_hours_dev" : "business_hours";
}

export function getCatalogServicesTable():
  | "catalog_services"
  | "catalog_services_dev" {
  return isDevelopmentDataSite()
    ? "catalog_services_dev"
    : "catalog_services";
}

export function getSiteDataEnvironmentLabel(): "Production" | "Development" {
  return isDevelopmentDataSite() ? "Development" : "Production";
}
