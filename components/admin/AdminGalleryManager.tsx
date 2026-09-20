"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  getGalleryImageUrl,
  type GalleryImage,
} from "@/lib/supabase/client";
import { getGalleryBucket } from "@/lib/supabase/gallery-bucket";
import {
  deleteGalleryImage,
  listGalleryImages,
  reorderGalleryImages,
  updateGalleryCaption,
  uploadGalleryImage,
} from "@/lib/supabase/gallery-admin";

export function AdminGalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captionDrafts, setCaptionDrafts] = useState<Record<string, string>>(
    {},
  );

  const loadImages = useCallback(async () => {
    setLoading(true);
    const data = await listGalleryImages();
    setImages(data);
    setCaptionDrafts(
      Object.fromEntries(
        data.map((image) => [image.id, image.caption ?? ""]),
      ),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;

    setUploading(true);
    setError(null);
    setMessage(null);

    let uploadedCount = 0;
    for (const file of Array.from(files)) {
      const result = await uploadGalleryImage(file);
      if (result.error) {
        setError(result.error);
        break;
      }
      uploadedCount += 1;
    }

    event.target.value = "";
    setUploading(false);

    if (uploadedCount > 0) {
      setMessage(
        uploadedCount === 1
          ? "Photo uploaded successfully."
          : `${uploadedCount} photos uploaded successfully.`,
      );
      await loadImages();
    }
  }

  async function handleSaveCaption(id: string) {
    setError(null);
    setMessage(null);

    const result = await updateGalleryCaption(id, captionDrafts[id] ?? "");
    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage("Caption saved.");
    await loadImages();
  }

  async function handleDelete(image: GalleryImage) {
    const confirmed = window.confirm("Delete this photo from the gallery?");
    if (!confirmed) return;

    setError(null);
    setMessage(null);

    const result = await deleteGalleryImage(image);
    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage("Photo deleted.");
    await loadImages();
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    setError(null);
    setMessage(null);

    const result = await reorderGalleryImages(images, id, direction);
    if (result.error) {
      setError(result.error);
      return;
    }

    await loadImages();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-blush-200 bg-white/80 p-6 shadow-sm">
        <h2 className="font-display text-2xl font-semibold text-charcoal">
          Upload Photos
        </h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Add one or more images. You can edit captions and order after upload.
        </p>
        <p className="mt-2 text-xs text-charcoal/50">
          Using storage bucket:{" "}
          <span className="font-medium text-blush-600">{getGalleryBucket()}</span>
        </p>

        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blush-300 bg-blush-50/60 px-6 py-10 text-center transition hover:border-blush-400 hover:bg-blush-50">
          <span className="text-sm font-medium text-blush-600">
            {uploading ? "Uploading..." : "Choose photos to upload"}
          </span>
          <span className="mt-2 text-xs text-charcoal/50">
            JPG, PNG, or WebP
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={handleUpload}
            className="sr-only"
          />
        </label>
      </section>

      {(message || error) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            error
              ? "bg-rose-100 text-charcoal"
              : "bg-blush-100 text-charcoal/80"
          }`}
        >
          {error ?? message}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold text-charcoal">
            Gallery Photos
          </h2>
          <span className="text-sm text-charcoal/60">
            {images.length} photo{images.length === 1 ? "" : "s"}
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-blush-100"
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-2xl border border-blush-200 bg-white/70 px-6 py-12 text-center text-sm text-charcoal/60">
            No photos yet. Upload your first gallery image above.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image, index) => {
              const url = getGalleryImageUrl(
                image.storage_path,
                image.bucket_id,
              );

              return (
                <article
                  key={image.id}
                  className="overflow-hidden rounded-2xl border border-blush-200 bg-white shadow-sm"
                >
                  <div className="aspect-[3/4] bg-blush-50">
                    {url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={image.caption ?? "Gallery photo"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-charcoal/40">
                        Preview unavailable
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-4">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-charcoal/50">
                        Caption
                      </label>
                      <input
                        type="text"
                        value={captionDrafts[image.id] ?? ""}
                        onChange={(event) =>
                          setCaptionDrafts((current) => ({
                            ...current,
                            [image.id]: event.target.value,
                          }))
                        }
                        placeholder="Optional caption"
                        className="w-full rounded-xl border border-blush-200 px-3 py-2 text-sm text-charcoal outline-none transition focus:border-blush-400 focus:ring-2 focus:ring-blush-200"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveCaption(image.id)}
                        className="rounded-full bg-blush-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blush-600"
                      >
                        Save caption
                      </button>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleReorder(image.id, "up")}
                        className="rounded-full border border-blush-300 px-4 py-2 text-xs font-medium text-charcoal transition hover:bg-blush-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Move up
                      </button>
                      <button
                        type="button"
                        disabled={index === images.length - 1}
                        onClick={() => handleReorder(image.id, "down")}
                        className="rounded-full border border-blush-300 px-4 py-2 text-xs font-medium text-charcoal transition hover:bg-blush-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Move down
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(image)}
                        className="rounded-full border border-rose-200 px-4 py-2 text-xs font-medium text-blush-700 transition hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
