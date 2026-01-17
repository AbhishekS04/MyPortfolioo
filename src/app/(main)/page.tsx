"use client";

import { motion } from "framer-motion";
import { BentoGallery } from "@/components/home/bento-gallery";
import dynamic from "next/dynamic";

// Code Split / Lazy Load below-the-fold content
const FeaturedProjects = dynamic(() => import("@/components/home/featured-projects").then(mod => mod.FeaturedProjects), {
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-3xl" />
});
const TestimonialsMinimal = dynamic(() => import("@/components/ui/minimal-testimonial").then(mod => mod.TestimonialsMinimal), { ssr: false });
const ContactSection = dynamic(() => import("@/components/home/contact-section").then(mod => mod.ContactSection), { ssr: false });

import { ConsciousnessMode } from "@/components/ui/consciousness-mode";
import { ClipboardSecret } from "@/components/ui/clipboard-secret";
import { ExitMessage } from "@/components/ui/exit-message";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 relative overflow-x-hidden">
      <ExitMessage />
      <ClipboardSecret />
      <ConsciousnessMode />
      <div className="relative z-0">
        {/* --- Hero Section (Eager Load) --- */}
        {/* Enforces 100vh and absolute centering on Desktop only (lg: 1024px+) */}
        <div className="lg:h-screen lg:overflow-hidden flex flex-col pt-24 md:pt-28 lg:pt-0 pb-6 px-4 md:px-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] lg:min-h-0">
          {/* Optical Spacer for Navbar balance on Desktop */}
          <div className="hidden lg:block h-16 shrink-0" />

          <div className="flex-1 flex flex-col justify-center">
            <BentoGallery />
          </div>
        </div>

        {/* --- Below-the-fold content --- */}
        <div className="mt-32 px-4 md:px-8 max-w-[1600px] mx-auto space-y-32 pb-32">
          <FeaturedProjects />
          {/* <TestimonialsMinimal /> */}
          <ContactSection />
        </div>
      </div>
    </main>
  );
}
