import type { Metadata } from "next";
import { BookButton } from "@/components/BookButton";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Browse hair transformations and styling work from ${siteConfig.name}.`,
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Gallery"
        description="Soft color, pretty details, and styles that make you feel like you. More photos added regularly."
      />

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <GalleryGrid />

        <div className="mt-16 rounded-2xl border border-blush-200 bg-blush-50/50 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-charcoal">
            Love what you see?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-charcoal/70">
            Book an appointment and bring your inspo — let&apos;s create
            something beautiful together.
          </p>
          <div className="mt-6">
            <BookButton />
          </div>
        </div>
      </section>
    </>
  );
}
