import { Metadata } from "next";
import { BentoGallery } from "@/components/home/bento-gallery";
import { getGalleryImages, getFeaturedProjects } from "@/app/actions/gallery";
import { LazyHomeContent } from "@/components/home/lazy-home-content";

import { ConsciousnessMode } from "@/components/ui/consciousness-mode";
import { ClipboardSecret } from "@/components/ui/clipboard-secret";
import { ExitMessage } from "@/components/ui/exit-message";

// Revalidate every 60 seconds so admin panel updates appear without a full rebuild
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Abhishek Singh | Portfolio",
  description:
    "Product Engineer specializing in React, Next.js, and high-performance web applications with a focus on interaction design.",
};

export default async function Home() {
  // Fetch data on server - instant availability
  const [galleryImages, featuredProjects] = await Promise.all([
    getGalleryImages(),
    getFeaturedProjects(),
  ]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 relative overflow-x-hidden">
      {/* Visually hidden elements for SEO & AI LLM Extraction */}
      <h1 className="sr-only">Abhishek Singh — Product Engineer</h1>
      <div className="sr-only">
        <p>
          Abhishek Singh is a Product Engineer and Full Stack Developer
          specializing in React, Next.js, TypeScript, and modern web
          architecture. With a strong focus on interaction design, Abhishek
          builds high-performance web applications and premium digital
          experiences. His portfolio features extensive work in frontend
          architecture, UI/UX design, and creative development.
        </p>
      </div>
      <ExitMessage />
      <ClipboardSecret />
      <ConsciousnessMode />
      <div className="relative z-0">
        {/* --- Hero Section (Eager Load) --- */}
        {/* Centers content on Desktop but allows scrolling if screen is too small */}
        <div className="lg:min-h-screen flex flex-col pt-24 md:pt-28 lg:pt-0 pb-6 px-4 md:px-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)]">
          {/* Optical Spacer for Navbar balance on Desktop */}
          <div className="hidden lg:block h-16 shrink-0" />

          <div className="flex-1 flex flex-col justify-center">
            <BentoGallery galleryImages={galleryImages} />
          </div>
        </div>

        {/* --- Below-the-fold content --- */}
        <LazyHomeContent featuredProjects={featuredProjects} />
      </div>
    </main>
  );
}
