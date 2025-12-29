"use client";

import { motion } from "framer-motion";
import { NavBar } from "@/components/ui/navbar";
import { BentoGallery } from "@/components/home/bento-gallery";
import dynamic from "next/dynamic";

// Code Split / Lazy Load below-the-fold content
const FeaturedProjects = dynamic(() => import("@/components/home/featured-projects").then(mod => mod.FeaturedProjects), {
  loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-3xl" />
});
const ContactSection = dynamic(() => import("@/components/home/contact-section").then(mod => mod.ContactSection));

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 relative overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-0"
      >
        <NavBar />

        <div className="pt-16 md:pt-20 lg:pt-14 pb-6 px-4 md:px-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-center">
          {/* --- Hero Grid (Eager Load) --- */}
          <BentoGallery />

          {/* --- Lazy Loaded Sections --- */}
          <div className="mt-32 space-y-32">
            <FeaturedProjects />
            <ContactSection />
          </div>
        </div>
      </motion.div>
    </main>
  );
}
