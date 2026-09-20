import {
  fetchGalleryImages,
  getSupabaseClient,
  type GalleryImage,
} from "@/lib/supabase/client";
import { getGalleryBucket } from "@/lib/supabase/gallery-bucket";

function requireClient() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }
  return supabase;
}

function sanitizeFileName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildStoragePath(fileName: string): string {
  const safeName = sanitizeFileName(fileName) || "photo.jpg";
  const stamp = Date.now();
  return `${stamp}-${safeName}`;
}

export async function listGalleryImages(): Promise<GalleryImage[]> {
  return fetchGalleryImages();
}

export async function uploadGalleryImage(
  file: File,
  caption?: string,
): Promise<{ image: GalleryImage | null; error: string | null }> {
  const supabase = requireClient();

  const existing = await fetchGalleryImages();
  const nextSortOrder =
    existing.reduce((max, image) => Math.max(max, image.sort_order), -1) + 1;

  const storagePath = buildStoragePath(file.name);
  const bucketId = getGalleryBucket();

  const { error: uploadError } = await supabase.storage
    .from(bucketId)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    return { image: null, error: uploadError.message };
  }

  const { data, error: insertError } = await supabase
    .from("gallery_images")
    .insert({
      storage_path: storagePath,
      bucket_id: bucketId,
      caption: caption?.trim() || null,
      sort_order: nextSortOrder,
    })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from(bucketId).remove([storagePath]);
    return { image: null, error: insertError.message };
  }

  return { image: data as GalleryImage, error: null };
}

export async function updateGalleryCaption(
  id: string,
  caption: string,
): Promise<{ error: string | null }> {
  const supabase = requireClient();

  const { error } = await supabase
    .from("gallery_images")
    .update({ caption: caption.trim() || null })
    .eq("id", id);

  return { error: error?.message ?? null };
}

export async function updateGallerySortOrder(
  id: string,
  sortOrder: number,
): Promise<{ error: string | null }> {
  const supabase = requireClient();

  const { error } = await supabase
    .from("gallery_images")
    .update({ sort_order: sortOrder })
    .eq("id", id);

  return { error: error?.message ?? null };
}

export async function deleteGalleryImage(
  image: GalleryImage,
): Promise<{ error: string | null }> {
  const supabase = requireClient();

  const { error: storageError } = await supabase.storage
    .from(image.bucket_id)
    .remove([image.storage_path]);

  if (storageError) {
    return { error: storageError.message };
  }

  const { error: deleteError } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", image.id);

  return { error: deleteError?.message ?? null };
}

export async function reorderGalleryImages(
  images: GalleryImage[],
  id: string,
  direction: "up" | "down",
): Promise<{ error: string | null }> {
  const index = images.findIndex((image) => image.id === id);
  if (index === -1) {
    return { error: "Image not found." };
  }

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= images.length) {
    return { error: null };
  }

  const current = images[index];
  const target = images[swapIndex];

  const firstUpdate = await updateGallerySortOrder(
    current.id,
    target.sort_order,
  );
  if (firstUpdate.error) return firstUpdate;

  const secondUpdate = await updateGallerySortOrder(
    target.id,
    current.sort_order,
  );
  return secondUpdate;
}
