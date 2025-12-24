"use client"

import { VerticalImageStack } from "@/components/ui/vertical-image-stack";
import { LocationTag } from "@/components/ui/location-tag";
import { NavBar } from "@/components/ui/navbar";
import { Sparkles } from "lucide-react";

export default function Home() {
  const cards = [
    {
      icon: <Sparkles className="size-4 text-blue-300" />,
      title: "Featured",
      description: "Discover amazing content",
      date: "Just now",
      iconClassName: "text-blue-500",
      titleClassName: "text-blue-500",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    // ... other cards data if needed later
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#ededed]">

      {/* Navigation Bar (contains Logo, Links, and SocialStories) */}
      <NavBar />

      <div className="p-4 xl:p-8 pt-24 lg:pt-28 flex items-center justify-center min-h-screen">
        {/* Main Grid: Adjusted to 2 columns since SocialStories moved to Nav */}
        <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-screen h-auto lg:h-[80vh] xl:h-[70vh]">

          {/* --- Col 1: Left Column (About - Tall) --- */}
          {/* On mobile: fixed height or auto. On desktop: full height */}
          <div className="col-span-1 bg-[#111111] rounded-[32px] p-10 flex flex-col justify-between border border-white/5 relative overflow-hidden group h-[500px] lg:h-full">
            {/* Top Left Location Tag */}
            <div className="absolute top-8 left-8 z-20">
              <LocationTag city="Kolkata " country="India" timezone="IST" />
            </div>

            <div className="z-10 h-full flex items-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-white/90">
                <span className="font-bold text-white">Antigravity</span> is building <span className="underline decoration-1 underline-offset-4 decoration-white/30">the future</span> of digital experiences.
              </h1>
            </div>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          </div>

          {/* --- Col 2: Right Column (Vertical Stack) --- */}
          {/* Expanded to take the remaining space */}
          <div className="col-span-1 h-[500px] lg:h-full border border-white/5 rounded-[32px] overflow-hidden bg-[#111111] relative shadow-2xl">
            <VerticalImageStack />
          </div>

        </div>
      </div>
    </main>
  );
}
