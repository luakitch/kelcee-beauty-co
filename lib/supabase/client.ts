import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type GalleryImage = {
  id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, anonKey);
  }

  return supabaseClient;
}

export function getGalleryImageUrl(storagePath: string): string | null {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data } = supabase.storage.from("gallery").getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as GalleryImage[];
}
