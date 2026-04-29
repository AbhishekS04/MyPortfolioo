import { Metadata } from "next";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { WorksClient } from "./client";

// Revalidate every 60 seconds so admin panel updates appear without a full rebuild
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Works",
  description:
    "Abhishek Singh's project portfolio — a curated showcase of full-stack web apps, React experiments, and production work. Built with Next.js, TypeScript, Supabase, and Tailwind CSS.",
  openGraph: {
    title: "Works & Projects | Abhishek Singh",
    description:
      "Abhishek Singh's project portfolio — a curated showcase of full-stack web apps, React experiments, and production work. Built with Next.js, TypeScript, Supabase, and Tailwind CSS.",
    url: "https://abhisheksingh.tech/works",
    siteName: "Abhishek Singh Portfolio",
    images: [
      {
        url: "/og-image-works.png",
        width: 1200,
        height: 630,
        alt: "Abhishek Singh Works & Projects",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Works & Projects | Abhishek Singh",
    description:
      "Abhishek Singh's project portfolio — a curated showcase of full-stack web apps, React experiments, and production work. Built with Next.js, TypeScript, Supabase, and Tailwind CSS.",
    images: ["/og-image-works.png"],
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://abhisheksingh.tech",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Works",
        item: "https://abhisheksingh.tech/works",
      },
    ],
  };

  return (
    <>
      {/* BreadcrumbList for SERP rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Suspense is required because WorksClient uses useSearchParams() */}
      <Suspense fallback={null}>
        <WorksClient projects={projects || []} />
      </Suspense>
    </>
  );
}
