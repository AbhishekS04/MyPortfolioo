"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocationTag } from "@/components/ui/location-tag";
import { VerticalImageStack } from "@/components/ui/vertical-image-stack";
import { NavBar } from "@/components/ui/navbar";
import { Preloader } from "@/components/ui/preloader"; // Verified path

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // User requested "Whenever I reload I will get the greetings", so we skipped sessionStorage check
  // If we wanted single-session:
  /*
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("intro_seen");
    if (hasSeenIntro) {
      setIsLoading(false);
    }
  }, []);
  */

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    // sessionStorage.setItem("intro_seen", "true"); // Optional: disable needed for "every reload"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">

            {/* --- Col 1: Left Column (About - Tall) --- */}
            <div className="col-span-1 bg-[#111111] rounded-[32px] p-10 flex flex-col justify-between border border-white/5 relative overflow-hidden group h-[500px] lg:h-full">
              {/* Top Left Location Tag */}
              <div className="absolute top-8 left-8 z-20">
                <LocationTag city="Kolkata " country="India" timezone="IST" />
              </div>

              <div className="z-10 h-full flex items-center">
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-white/90">
                    <span className="font-bold text-white">Antigravity</span> is building <span className="underline decoration-1 underline-offset-4 decoration-white/30">the future</span> of digital experiences.
                  </h1>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            </div>

            {/* --- Col 2: Right Column (Vertical Image Stack) --- */}
            <div className="col-span-1 h-[500px] lg:h-full border border-white/5 rounded-[32px] overflow-hidden bg-[#111111] relative shadow-2xl">
              <VerticalImageStack />
            </div>

          </div>
        </div>
      </motion.div>
    </main>
  );
}
