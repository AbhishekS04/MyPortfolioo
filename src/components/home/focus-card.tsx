"use client";

import { motion } from "framer-motion";

export function FocusCard() {
    return (
        <div className="w-full h-32 bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden flex flex-col justify-center px-6 md:px-8 group relative">
            <div className="z-10">
                <h3 className="text-white/40 text-xs font-medium uppercase tracking-widest mb-2">Focus</h3>
                <p className="text-white/90 font-medium text-sm md:text-base leading-snug">
                    Frontend Engineering, UI Systems,<br className="hidden md:block" /> Modern Web & AI-Assisted Dev.
                </p>
            </div>
            {/* Subtile Hover Glow */}
            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    );
}
