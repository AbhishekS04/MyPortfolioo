"use server";

import { supabase } from "@/lib/supabase";
import { Project } from "@/lib/data";

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .eq("is_hidden", false)
      .order("display_order", { ascending: true });

    if (error) {
      console.error(
        "Error fetching featured projects:",
        error.message,
        error.code,
        error.details,
        error.hint,
      );
      return [];
    }

    if (data && data.length > 0) {
      return data.map(
        (item: {
          id: string;
          title: string;
          description: string;
          tech_stack: string[];
          image_url: string;
          github_url?: string;
          live_url?: string;
          display_order?: number;
          featured?: boolean;
          tech_stack_icons?: string;
          is_coming_soon?: boolean;
          slug?: string;
        }) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        techStack: item.tech_stack || [],
        image: item.image_url,
        is_coming_soon: item.is_coming_soon,
        link: `/works/${item.slug}?from=home`,
      }));
    }

    return [];
  } catch (err) {
    console.error("Unexpected error fetching featured projects:", err);
    return [];
  }
}

export async function getGalleryImages(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error(
        "Error fetching gallery images:",
        error.message,
        error.code,
        error.details,
        error.hint,
      );
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
