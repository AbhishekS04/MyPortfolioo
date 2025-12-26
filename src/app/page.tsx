"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocationTag } from "@/components/ui/location-tag";
import { VerticalImageStack } from "@/components/ui/vertical-image-stack";
import { NavBar } from "@/components/ui/navbar";
import { Preloader } from "@/components/ui/preloader"; // Verified path
import { FeaturedProjects } from "@/components/home/featured-projects";
import { ContactSection } from "@/components/home/contact-section";
import { TechIdentityCard } from "@/components/home/tech-identity-card";
import { FocusCard } from "@/components/home/focus-card";

import { ArrowUpRight } from "lucide-react";
import { BentoGallery } from "@/components/home/bento-gallery";

let hasShownPreloader = false;

export default function Home() {
  const [isLoading, setIsLoading] = useState(!hasShownPreloader);

  // Preloader Logic: Show only on initial load/refresh, not on navigation
  useEffect(() => {
    if (!hasShownPreloader) {
      setIsLoading(true);
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      setIsLoading(false);
      document.body.style.overflow = "";
    }
  }, []);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    hasShownPreloader = true;
    // Restore scroll and force top
    document.body.style.overflow = "";
    window.scrollTo(0, 0);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 relative overflow-x-hidden">
      {/* Preloader Overlay */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <Preloader onComplete={handlePreloaderComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Animate In */}
      <motion.div
        initial={isLoading ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.98 : 1 }}
        transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
        className="relative z-0"
      >
        <NavBar />

        <div className="pt-28 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto">
          {/* --- Hero Grid --- */}
          {/* --- New Bento Gallery Layout --- */}
          <BentoGallery />

          {/* --- New Sections --- */}
          <div className="mt-32 space-y-32">
            <FeaturedProjects />
            {/* Thinking + Skills section removed */}
            <ContactSection />
          </div>
        </div>
      </motion.div>
    </main>
  );
}
