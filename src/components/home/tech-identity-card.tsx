"use client";

import { motion } from "framer-motion";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiSupabase, SiFigma, SiGithub, SiNodedotjs } from "react-icons/si";

const ICONS = [
    { Icon: SiReact, color: "text-[#61DAFB]" },
    { Icon: SiNextdotjs, color: "text-white" },
    { Icon: SiTypescript, color: "text-[#3178C6]" },
    { Icon: SiTailwindcss, color: "text-[#06B6D4]" },
    { Icon: SiSupabase, color: "text-[#3ECF8E]" },
    { Icon: SiFigma, color: "text-[#F24E1E]" },
    { Icon: SiNodedotjs, color: "text-[#339933]" },
    { Icon: SiGithub, color: "text-white" },
];

export function TechIdentityCard() {
    return (
        <div className="w-full h-full bg-[#1A1A1A] border border-white/5 rounded-[32px] md:rounded-full flex items-center relative overflow-hidden shadow-2xl ring-1 ring-white/5">
            {/* Fade Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#1A1A1A] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#1A1A1A] to-transparent z-10" />

            {/* Sliding Track - Infinite Loop Left -> Right */}
            <div className="flex items-center w-full">
                <motion.div
                    className="flex items-center gap-12 md:gap-16 pr-12 md:pr-16"
                    initial={{ x: "-50%" }}
                    animate={{ x: "0%" }}
                    transition={{
                        repeat: Infinity,
                        duration: 30, // Adjusted speed for react-icons
                        ease: "linear",
                    }}
                >
                    {/* Repeat items enough times to fill and loop seamlessly */}
                    {[...ICONS, ...ICONS, ...ICONS, ...ICONS].map((item, i) => (
                        <div key={i} className={`min-w-[32px] md:min-w-[40px] flex justify-center opacity-50 hover:opacity-100 transition-opacity duration-300 ${item.color}`}>
                            <item.Icon className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
