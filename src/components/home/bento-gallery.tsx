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

            {/* 3 Column Grid for Laptop/Desktop - Stacks on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* --- Column 1 (Left) --- */}
                {/* Reference: Chef (Tall) + Typography (Short) */}
                <div className="flex flex-col gap-6">
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
                <div className="flex flex-col gap-6">
                    {/* Tech Stack - SHORT */}
                    <div className="h-[200px]">
                        <TechIdentityCard />
                    </div>

                    {/* Gallery/Phone - TALL */}
                    <div className="flex-[2] min-h-[500px] bg-[#111] rounded-[32px] border border-white/5 overflow-hidden relative shadow-2xl">
                        <div className="absolute inset-0">
                            <VerticalImageStack />
                        </div>
                    </div>
                </div>

                {/* --- Column 3 (Right) --- */}
                {/* Reference: Users (Short) + Review (Short) + Food (Short) */}
                <div className="flex flex-col gap-6">
                    {/* Focus/Stats - SHORT */}
                    <div className="h-[220px]">
                        <FocusCard />
                    </div>

                    {/* Location/Orange Slot - SHORT */}
                    <div className="h-[180px] bg-[#FF4D00] rounded-[32px] p-6 relative overflow-hidden group">
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
