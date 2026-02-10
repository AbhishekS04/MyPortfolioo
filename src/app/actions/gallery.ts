"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
}

export async function getGalleryImages(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured) {
    console.warn("Supabase credentials missing. Returning empty gallery.");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching gallery images:", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((item, i) => ({
        id: i + 1,
        src: item.image_url,
        alt: item.alt_text || "Gallery Image",
      }));
    }

    return [];
  } catch (err) {
    console.error("Unexpected error fetching gallery images:", err);
    return [];
  }
}
