"use client";

import { motion } from "framer-motion";
import {
    SiCplusplus,
    SiHtml5,
    SiCss3,
    SiJavascript,
    SiTypescript,
    SiReact,
    SiNextdotjs,
    SiBootstrap
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

// Key-Component Mapping
const ICONS = {
    "cpp": <SiCplusplus className="w-full h-full" />,
    "java": <FaJava className="w-full h-full" />,
    "html": <SiHtml5 className="w-full h-full" />,
    "css": <SiCss3 className="w-full h-full" />,
    "js": <SiJavascript className="w-full h-full" />,
    "ts": <SiTypescript className="w-full h-full" />,
    "react": <SiReact className="w-full h-full" />,
    "next": <SiNextdotjs className="w-full h-full" />,
    "bootstrap": <SiBootstrap className="w-full h-full" />,
};

const LOGO_KEYS = Object.keys(ICONS) as (keyof typeof ICONS)[];

export function TechIdentityCard() {
    return (
        <div className="w-full h-40 bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden relative flex flex-col justify-between p-6 group">
            {/* Header with Status Dot */}
            <div className="flex items-center gap-3 z-20">
                <div className="relative flex items-center justify-center w-2 h-2">
                    <div className="absolute w-full h-full bg-emerald-500 rounded-full animate-ping opacity-75" />
                    <div className="relative w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                </div>
                <span className="text-xs font-medium uppercase tracking-widest text-white/40">Tech Stack</span>
            </div>

            {/* Gradient Masks for fade out effect - Adjusted for content area */}
            <div className="absolute left-0 bottom-0 top-16 w-16 bg-gradient-to-r from-[#111111] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 bottom-0 top-16 w-16 bg-gradient-to-l from-[#111111] to-transparent z-10 pointer-events-none" />

            {/* Scrolling Container */}
            <div className="flex overflow-hidden w-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 mt-2">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    className="flex gap-12 md:gap-16 flex-shrink-0 items-center"
                >
                    {[...LOGO_KEYS, ...LOGO_KEYS].map((key, index) => (
                        <div key={`${key}-${index}`} className="w-8 h-8 flex-shrink-0 text-white/40 hover:text-white transition-colors duration-500">
                            {ICONS[key]}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
