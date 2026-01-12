"use client";
import { FaJava } from "react-icons/fa";

import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiSupabase, SiFigma, SiC, SiCplusplus, SiOpenjdk, SiPython, SiPostgresql, SiDocker, SiGo, SiRust, SiNodedotjs, SiMongodb, SiRedis, SiAmazonwebservices, SiGit, SiPostman, SiGithub, SiServerless } from "react-icons/si";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function FocusCard() {
    const [isGolden, setIsGolden] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (isGolden) {
            const timer = setTimeout(() => setIsGolden(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isGolden]);

    return (
        <div
            onDoubleClick={() => setIsGolden(prev => !prev)}
            onMouseDown={(e) => { if (e.detail > 1) e.preventDefault(); }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="w-full h-full bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden flex flex-col p-6 sm:p-8 relative group hover:border-white/10 transition-colors cursor-pointer select-none"
        >
            {/* Main Content Layout */}
            <div className="flex flex-row justify-between items-start h-full pt-2">
                {/* Left Column - All technology tags */}
                <div className="flex flex-col gap-6 overflow-y-auto pr-2 pl-2 pb-10 scrollbar-hide mask-image-b w-full relative z-10">

                    {/* Core Stack Section */}
                    <div className="flex flex-col gap-3">
                        {/* Header: Core Stack (Blue Dot) */}
                        <div className="flex items-center gap-3 sticky top-0 bg-[#111111]/95 backdrop-blur-sm py-2 z-20">
                            <motion.div
                                style={{
                                    boxShadow: isGolden
                                        ? "0 0 2px rgba(234,179,8,0.8)"
                                        : "0 0 2px rgba(59,130,246,0.8)"
                                }}
                                className={`w-1.5 h-1.5 rounded-full ${isGolden ? "bg-yellow-500" : "bg-blue-500"}`}
                            />
                            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Core Stack</span>
                        </div>

                        <div className={`flex items-center gap-4 text-white/50 hover:text-[#61DAFB] transition-all duration-300 group/item pl-1 ${isGolden ? "opacity-100" : "opacity-100"}`}>
                            <SiNextdotjs className={`w-4 h-4 sm:w-5 sm:h-5 ${isGolden ? "text-[#61DAFB] drop-shadow-[0_0_5px_rgba(97,218,251,0.5)]" : "text-[#61DAFB]"}`} />
                            <span className={`text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono ${isGolden ? "text-[#61DAFB] drop-shadow-[0_0_5px_rgba(97,218,251,0.5)]" : ""}`}>Next.js & React</span>
                        </div>
                        <div className={`flex items-center gap-4 text-white/50 hover:text-[#3178C6] transition-all duration-300 group/item pl-1 ${isGolden ? "opacity-100" : "opacity-100"}`}>
                            <div className="flex gap-2">
                                <SiNodedotjs className={`w-4 h-4 sm:w-5 sm:h-5 ${isGolden ? "text-[#339933] drop-shadow-[0_0_5px_rgba(51,153,51,0.5)]" : "text-[#339933]"}`} />
                                <SiTypescript className={`w-4 h-4 sm:w-5 sm:h-5 ${isGolden ? "text-[#3178C6] drop-shadow-[0_0_5px_rgba(49,120,198,0.5)]" : "text-[#3178C6]"}`} />
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold tracking-wide leading-tight uppercase font-mono">
                                <span className={isGolden ? "text-[#339933] drop-shadow-[0_0_5px_rgba(51,153,51,0.5)]" : ""}>Node.js</span>
                                <span className={isGolden ? "text-white/50" : ""}> & </span>
                                <span className={isGolden ? "text-[#3178C6] drop-shadow-[0_0_5px_rgba(49,120,198,0.5)]" : ""}>TS</span>
                            </span>
                        </div>
                        <div className={`flex items-center gap-4 text-white/50 hover:text-[#06B6D4] transition-all duration-300 group/item pl-1 ${isGolden ? "opacity-100" : "opacity-100"}`}>
                            <SiTailwindcss className={`w-4 h-4 sm:w-5 sm:h-5 ${isGolden ? "text-[#06B6D4] drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" : "text-[#06B6D4]"}`} />
                            <span className={`text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono ${isGolden ? "text-[#06B6D4] drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" : ""}`}>Tailwind CSS</span>
                        </div>
                    </div>

                    {/* Other Stacks Section */}
                    <div className="flex flex-col gap-3 mt-2">
                        {/* Header: Other Stacks (Red Dot) */}
                        <div className="flex items-center gap-3 sticky top-0 bg-[#111111]/95 backdrop-blur-sm py-2 z-20">
                            <motion.div
                                style={{
                                    boxShadow: isGolden
                                        ? "0 0 2px rgba(234,179,8,0.8)"
                                        : "0 0 2px rgba(239,68,68,0.8)"
                                }}
                                className={`w-1.5 h-1.5 rounded-full ${isGolden ? "bg-yellow-500" : "bg-red-500"}`}
                            />
                            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Other Stacks</span>
                        </div>

                        <div className={`flex items-center gap-4 text-white/50 hover:text-[#4169E1] transition-all duration-300 group/item pl-1 ${isGolden ? "opacity-100" : "opacity-100"}`}>
                            <div className="flex gap-1.5">
                                <SiPostgresql className={`w-4 h-4 ${isGolden ? "text-[#4169E1] opacity-40" : "text-[#4169E1]"}`} />
                                <SiPostgresql className={`w-4 h-4 ${isGolden ? "text-[#00E599] scale-125 drop-shadow-[0_0_5px_rgba(0,229,153,0.5)]" : "text-[#00E599]"}`} />
                                <SiMongodb className={`w-4 h-4 ${isGolden ? "text-[#47A248] opacity-40" : "text-[#47A248]"}`} />
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold tracking-wide leading-tight uppercase font-mono">
                                <span className={isGolden ? "opacity-40" : ""}>SQL, </span>
                                <span className={isGolden ? "text-[#00E599] drop-shadow-[0_0_5px_rgba(0,229,153,0.5)]" : ""}>Neon</span>
                                <span className={isGolden ? "opacity-40" : ""}> & NoSQL</span>
                            </span>
                        </div>
                        <div className={`flex items-center gap-4 text-white/50 hover:text-[#FFD43B] transition-all duration-300 group/item pl-1 ${isGolden ? "opacity-100" : "opacity-100"}`}>
                            <SiPython className={`w-4 h-4 sm:w-5 sm:h-5 ${isGolden ? "text-[#3776AB] drop-shadow-[0_0_5px_rgba(55,118,171,0.5)]" : "text-[#3776AB]"}`} />
                            <span className={`text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono ${isGolden ? "text-[#3776AB] drop-shadow-[0_0_5px_rgba(55,118,171,0.5)]" : ""}`}>Python</span>
                        </div>
                        <div className={`flex items-center gap-4 text-white/50 hover:text-[#DEA584] transition-all duration-300 group/item pl-1 ${isGolden ? "opacity-20" : "opacity-100"}`}>
                            <div className="flex gap-1.5">
                                <SiGo className="w-4 h-4 text-[#00ADD8]" />
                                <SiRust className="w-4 h-4 text-[#DEA584]" />
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">Go / Rust (Allegedly 🤷‍♂️)</span>
                        </div>
                        <div className={`flex items-center gap-4 text-white/50 hover:text-[#ED8B00] transition-all duration-300 group/item pl-1 ${isGolden ? "opacity-100" : "opacity-100"}`}>
                            <FaJava className={`w-4 h-4 sm:w-5 sm:h-5 ${isGolden ? "text-[#ED8B00] drop-shadow-[0_0_5px_rgba(237,139,0,0.5)]" : "text-[#ED8B00]"}`} />
                            <span className={`text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono ${isGolden ? "text-[#ED8B00] drop-shadow-[0_0_5px_rgba(237,139,0,0.5)]" : ""}`}>Java</span>
                        </div>
                        <div className={`flex items-center gap-4 text-white/50 hover:text-[#00599C] transition-all duration-300 group/item pl-1 ${isGolden ? "opacity-100" : "opacity-100"}`}>
                            <div className="flex gap-1.5">
                                <SiC className={`w-4 h-4 ${isGolden ? "text-[#A8B9CC] drop-shadow-[0_0_4px_rgba(168,185,204,0.5)]" : "text-[#A8B9CC]"}`} />
                                <SiCplusplus className={`w-4 h-4 ${isGolden ? "text-[#00599C] drop-shadow-[0_0_4px_rgba(0,89,156,0.5)]" : "text-[#00599C]"}`} />
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">
                                <span className={isGolden ? "text-[#A8B9CC] drop-shadow-[0_0_4px_rgba(168,185,204,0.5)]" : ""}>C</span>
                                <span className={isGolden ? "text-white/50" : ""}> / </span>
                                <span className={isGolden ? "text-[#00599C] drop-shadow-[0_0_4px_rgba(0,89,156,0.5)]" : ""}>C++</span>
                            </span>
                        </div>
                        <div className={`flex items-center gap-4 text-white/50 hover:text-[#2496ED] transition-all duration-300 group/item pl-1 ${isGolden ? "opacity-20" : "opacity-100"}`}>
                            <div className="flex gap-1.5">
                                <SiDocker className="w-4 h-4 text-[#2496ED]" />
                                <SiAmazonwebservices className="w-4 h-4 text-[#FF9900]" />
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">Cloud & Docker</span>
                        </div>
                        <div className={`flex items-center gap-4 text-white/50 hover:text-[#3ECF8E] transition-all duration-300 group/item pl-1 ${isGolden ? "opacity-100" : "opacity-100"}`}>
                            <div className="flex gap-1.5">
                                <SiSupabase className={`w-4 h-4 ${isGolden ? "text-[#3ECF8E] drop-shadow-[0_0_5px_rgba(62,207,142,0.5)]" : "text-[#3ECF8E]"}`} />
                                <SiServerless className={`w-4 h-4 ${isGolden ? "text-[#F5AC1F] drop-shadow-[0_0_5px_rgba(245,172,31,0.5)]" : "text-[#F5AC1F]"}`} />
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">
                                <span className={isGolden ? "text-[#3ECF8E] drop-shadow-[0_0_5px_rgba(62,207,142,0.5)]" : ""}>Supabase</span>
                                <span className={isGolden ? "text-white/50" : ""}> & </span>
                                <span className={isGolden ? "text-[#F5AC1F] drop-shadow-[0_0_5px_rgba(245,172,31,0.5)]" : ""}>Convex</span>
                            </span>
                        </div>
                        <div className={`flex items-center gap-4 text-white/50 hover:text-[#F05032] transition-all duration-300 group/item pl-1 ${isGolden ? "opacity-100" : "opacity-100"}`}>
                            <div className="flex gap-1.5">
                                <SiGit className={`w-4 h-4 ${isGolden ? "text-[#F05032] drop-shadow-[0_0_5px_rgba(240,80,50,0.5)]" : "text-[#F05032]"}`} />
                                <SiGithub className={`w-4 h-4 ${isGolden ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : "text-white"}`} />
                                <SiPostman className={`w-4 h-4 ${isGolden ? "text-[#FF6C37] opacity-40" : "text-[#FF6C37]"}`} />
                            </div>
                            <span className="text-[10px] sm:text-xs font-semibold tracking-wide leading-tight uppercase font-mono">
                                <span className={isGolden ? "text-[#F05032] drop-shadow-[0_0_5px_rgba(240,80,50,0.5)]" : ""}>Git, </span>
                                <span className={isGolden ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : ""}>GitHub </span>
                                <span className={isGolden ? "text-[#777]" : ""}>& </span>
                                <span className={isGolden ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : ""}>APIs</span>
                            </span>
                        </div>
                    </div >
                </div >

                {/* Right Area - Large spinning React icon */}
                < div className="flex-shrink-0 pt-4 pr-1 sm:pr-4 absolute right-4 top-12 pointer-events-none z-30" >
                    <motion.div
                        animate={{ rotate: (isHovering || isGolden) ? 360 : 0 }}
                        transition={{
                            duration: (isHovering || isGolden) ? 8 : 1.5,
                            repeat: (isHovering || isGolden) ? Infinity : 0,
                            ease: (isHovering || isGolden) ? "linear" : "easeOut"
                        }}
                    >
                        <SiReact className={`w-20 h-20 sm:w-28 sm:h-28 rotate-12 transition-all duration-700 ease-in-out ${isGolden ? "text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] opacity-80" : "text-[#61DAFB]/10 opacity-20 sm:opacity-100 group-hover:text-[#61DAFB]/40 group-hover:drop-shadow-[0_0_15px_rgba(97,218,251,0.3)]"}`} />
                    </motion.div>
                </div >
            </div >
        </div >
    );
}
