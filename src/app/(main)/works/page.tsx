import { Metadata } from "next";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { WorksClient } from "./client";

// Revalidate every 60 seconds so admin panel updates appear without a full rebuild
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Works",
  description:
    "A curated list of my projects, experiments, and current work in progress.",
  openGraph: {
    title: "Works | Abhishek Singh",
    description:
      "A curated list of my projects, experiments, and current work in progress.",
    url: "https://abhisheksingh.tech/works",
    siteName: "Abhishek Singh Portfolio",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Works | Abhishek Singh",
    description:
      "A curated list of my projects, experiments, and current work in progress.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://abhisheksingh.tech/works",
  },
};

export default async function WorksPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_hidden", false)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error.message);
  }

  return (
    // Suspense is required because WorksClient uses useSearchParams()
    <Suspense fallback={null}>
      <WorksClient projects={projects || []} />
    </Suspense>
  );
}
