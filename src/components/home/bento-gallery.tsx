"use client"
// Rebuilding layout to standard grid

import { motion } from "framer-motion"
import { IdentityCard } from "./identity-card"
import { VerticalImageStack } from "@/components/ui/vertical-image-stack"
import { FocusCard } from "./focus-card"
import { PhilosophyCard } from "./philosophy-card"
import { CraftCard } from "./craft-card"

export function BentoGallery() {
    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 md:px-6 pb-12 pt-4 md:py-24 lg:py-0">

            {/* 
                Responsive Bento Grid:
                - Mobile: 1 Column
                - Tablet (md): 2 Columns
                - Desktop (lg): 3 Columns
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min items-start">

                {/* 1. Identity Card - Top Left */}
                <div className="order-1 md:order-1 lg:col-span-1 h-[450px] md:h-[500px] lg:h-[500px]">
                    <IdentityCard />
                </div>

                {/* 2. Gallery/Phone - Center Column (Spans 2 Rows on Desktop) */}
                <div className="order-2 md:order-3 lg:order-2 md:col-span-1 lg:col-span-1 lg:row-span-2 h-[400px] md:h-[600px] lg:h-[764px] bg-[#111] rounded-[32px] border border-white/5 overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0">
                        <VerticalImageStack />
                    </div>
                </div>

                {/* 3. Focus Card - Top Right */}
                <div className="order-3 md:order-2 lg:order-3 md:col-span-1 lg:col-span-1 h-[550px] md:h-[500px] lg:h-[500px]">
                    <FocusCard />
                </div>

                {/* 4. Philosophy Card - Bottom Left */}
                <div className="order-4 md:order-4 lg:order-4 md:col-span-1 lg:col-span-1 h-[200px] md:h-[240px] lg:h-[240px]">
                    <PhilosophyCard />
                </div>

                {/* 5. Craft Card - Bottom Right */}
                <div className="order-5 md:order-5 lg:order-5 md:col-span-1 lg:col-span-1 h-[200px] md:h-[240px] lg:h-[240px]">
                    <CraftCard />
                </div>
            </div>
        </section>
    )
}
