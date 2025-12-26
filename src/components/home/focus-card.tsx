"use client";

import { motion } from "framer-motion";

export function FocusCard() {
    return (
        <div className="w-full h-40 bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden flex flex-col justify-between p-6 group relative">
            <div className="z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium uppercase tracking-widest text-white/40">Focus Area</span>
                </div>

                <h3 className="text-white font-medium text-lg leading-snug tracking-tight">
                    Frontend Engineering, <br />
                    UI Systems, AI & <br />
                    Modern Web.
                </h3>
            </div>
            {/* Subtile Hover Glow */}
            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    );
}
