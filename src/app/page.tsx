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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Preloader Logic: Always show on load/refresh
  useEffect(() => {
    setIsLoading(true);
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0); // Ensure top start
  }, []);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.98 : 1 }}
        transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
        className="relative z-0"
      >
        <NavBar />

        <div className="pt-28 pb-10 px-4 md:px-8 max-w-[1600px] mx-auto">
          {/* --- Hero Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[750px]">

            {/* --- Col 1: Left Stack (Intro + Tech/Focus Bento) --- */}
            <div className="flex flex-col gap-6 h-full">

              {/* Intro Card */}
              <div className="flex-1 bg-[#111111] rounded-[32px] p-10 flex flex-col justify-between border border-white/5 relative overflow-hidden group min-h-[350px]">
                {/* Top Left Location Tag */}
                <div className="absolute top-8 left-8 z-20">
                  <LocationTag city="Kolkata " country="India" timezone="IST" />
                </div>

                <div className="z-10 h-full flex items-center">
                  <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-white/90">
                      <span className="font-bold text-white">Antigravity</span> is building <span className="underline decoration-1 underline-offset-4 decoration-white/30">the future</span> of digital experiences.
                    </h1>

                    {/* Resume Button */}
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 border border-white/10 rounded-full text-sm font-medium text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all group/resume"
                    >
                      <span>View Resume</span>
                      <ArrowUpRight className="w-4 h-4 opacity-50 group-hover/resume:translate-x-0.5 group-hover/resume:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              </div>

              {/* Bento Row: Tech Identity + Focus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-shrink-0">
                <TechIdentityCard />
                <FocusCard />
              </div>

            </div>

            {/* --- Col 2: Right Column (Vertical Image Stack) --- */}
            <div className="col-span-1 h-[500px] lg:h-full border border-white/5 rounded-[32px] overflow-hidden bg-[#111111] relative shadow-2xl">
              <VerticalImageStack />
            </div>

          </div>

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
