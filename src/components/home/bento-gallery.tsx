"use client"
// Rebuilding layout to standard grid

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
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-12 pt-4 md:py-24">

            {/* 3 Column Grid for Laptop/Desktop - Standard Stack on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* --- Column 1 Wrapper --- */}
                {/* Mobile: Flattened (contents) | Desktop: Column Flex */}
                <div className="contents md:flex md:flex-col md:gap-6">
                    {/* Identity Card - TALL - Order 1 */}
                    <div className="order-1 md:order-none h-[450px] md:h-auto md:flex-[2] md:min-h-[500px]">
                        <IdentityCard />
                    </div>

                    {/* Philosophy/Typography - SHORT - Order 4 (Under Core Stack) */}
                    <div className="order-4 md:order-none h-[180px] md:h-[200px]">
                        <PhilosophyCard />
                    </div>
                </div>

                {/* --- Column 2 Wrapper --- */}
                <div className="contents md:flex md:flex-col md:gap-6">
                    {/* Tech Stack - COMPACT PILL STRIP - Order 5 (Under Typography) */}
                    <div className="order-5 md:order-none h-[80px] md:h-[120px]">
                        <TechIdentityCard />
                    </div>

                    {/* Gallery/Phone - TALLER - Order 2 (Under Identity) */}
                    <div className="order-2 md:order-none h-[400px] md:h-auto md:flex-[2] md:min-h-[620px] bg-[#111] rounded-[32px] border border-white/5 overflow-hidden relative shadow-2xl">
                        <div className="absolute inset-0">
                            <VerticalImageStack />
                        </div>
                    </div>
                </div>

                {/* --- Column 3 Wrapper --- */}
                <div className="contents md:flex md:flex-col md:gap-6">
                    {/* Core Stack - INCREASED HEIGHT - Order 3 (Under Gallery) */}
                    <div className="order-3 md:order-none min-h-[220px] md:h-auto md:flex-1">
                        <FocusCard />
                    </div>

                    {/* Craft/Food - Order 7 */}
                    <div className="order-7 md:order-none h-[240px] md:h-[240px] md:flex-none">
                        <CraftCard />
                    </div>
                </div>
            </div>
        </section>
    )
}
