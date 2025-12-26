"use client"

import { motion } from "framer-motion"
import { IdentityCard } from "./identity-card"
import { TechIdentityCard } from "./tech-identity-card"
import { VerticalImageStack } from "@/components/ui/vertical-image-stack"
import { FocusCard } from "./focus-card"
import { LocationTag } from "@/components/ui/location-tag"
import { PhilosophyCard } from "./philosophy-card"
import { CraftCard } from "./craft-card"
import { ArrowUpRight } from "lucide-react"

export function BentoGallery() {
    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-24">

            {/* 3 Column Grid for Laptop/Desktop - Horizontal Scroll for Mobile */}
            <div className="
                flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-4 px-4 scrollbar-hide
                md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:pb-0 md:px-0 md:mx-0 md:overflow-visible
            ">

                {/* Mobile Sizing: Each column takes ~85% of width to show "peek" effect */}
                {/* Desktop Sizing: Col-span reset to default grid behavior */}

                {/* --- Column 1 (Left) --- */}
                {/* Reference: Chef (Tall) + Typography (Short) */}
                <div className="flex flex-col gap-6 min-w-[85vw] md:min-w-0 snap-center shrink-0">
                    {/* Identity Card - TALL */}
                    <div className="flex-[2] min-h-[500px]">
                        <IdentityCard />
                    </div>

                    {/* Philosophy/Typography - SHORT */}
                    <div className="h-[200px]">
                        <PhilosophyCard />
                    </div>
                </div>

                {/* --- Column 2 (Center) --- */}
                {/* Reference: Icons (Short) + Phone (Tall) */}
                <div className="flex flex-col gap-6 min-w-[85vw] md:min-w-0 snap-center shrink-0">
                    {/* Tech Stack - COMPACT PILL STRIP */}
                    {/* Increased Height to fill gap and match visual weight */}
                    <div className="h-[120px]">
                        <TechIdentityCard />
                    </div>

                    {/* Gallery/Phone - TALLER */}
                    <div className="flex-[2] min-h-[620px] bg-[#111] rounded-[32px] border border-white/5 overflow-hidden relative shadow-2xl">
                        <div className="absolute inset-0">
                            <VerticalImageStack />
                        </div>
                    </div>
                </div>

                {/* --- Column 3 (Right) --- */}
                {/* Reference: Users (Short) + Review (Short) + Food (Short) */}
                <div className="flex flex-col gap-6 min-w-[85vw] md:min-w-0 snap-center shrink-0">
                    {/* Core Stack - INCREASED HEIGHT (Primary) */}
                    <div className="h-[290px]">
                        <FocusCard />
                    </div>

                    {/* Location/Orange Slot - REDUCED HEIGHT (Secondary) */}
                    <div className="h-[160px] bg-[#FF4D00] rounded-[32px] p-6 relative overflow-hidden group">
                        <div className="absolute top-6 right-6 p-2 rounded-full bg-black/10 text-black/60 group-hover:bg-white group-hover:text-black transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>

                        <div className="h-full flex flex-col justify-between text-white">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                <span className="text-xs font-medium uppercase tracking-widest text-white/80">Active Now</span>
                            </div>

                            <div>
                                <LocationTag className="!bg-black/20 !backdrop-blur-md mb-2 border-white/10" />
                                <p className="text-3xl font-bold leading-none">India</p>
                                <p className="text-white/60 text-xs mt-1">Open to opportunities</p>
                            </div>
                        </div>
                    </div>

                    {/* Craft/Food - SHORT */}
                    <div className="flex-1 min-h-[180px]">
                        <CraftCard />
                    </div>
                </div>

            </div>
        </section>
    )
}
