"use client";

import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiSupabase, SiFigma, SiC, SiCplusplus, SiOpenjdk, SiPython, SiPostgresql, SiDocker, SiGo, SiRust, SiNodedotjs, SiMongodb, SiRedis, SiAmazonwebservices, SiGit, SiPostman } from "react-icons/si";

export function FocusCard() {
    return (
        <div className="w-full h-full bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden flex flex-col p-6 sm:p-8 relative group hover:border-white/10 transition-colors">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Core Stack</span>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-row justify-between items-start h-full pt-2">
                {/* Left Column - All technology tags */}
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-4 text-white/50 hover:text-[#61DAFB] transition-all duration-300 group/item">
                        <SiNextdotjs className="w-4 h-4 sm:w-5 sm:h-5 text-[#61DAFB]" />
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">Next.js & React</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 hover:text-[#3178C6] transition-all duration-300 group/item">
                        <div className="flex gap-2">
                            <SiNodedotjs className="w-4 h-4 sm:w-5 sm:h-5 text-[#339933]" />
                            <SiTypescript className="w-4 h-4 sm:w-5 sm:h-5 text-[#3178C6]" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide leading-tight uppercase font-mono">Node.js & TS</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 hover:text-[#06B6D4] transition-all duration-300 group/item">
                        <SiTailwindcss className="w-4 h-4 sm:w-5 sm:h-5 text-[#06B6D4]" />
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">Tailwind CSS</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 hover:text-[#4169E1] transition-all duration-300 group/item">
                        <div className="flex gap-1.5">
                            <SiPostgresql className="w-4 h-4 text-[#4169E1]" />
                            <SiMongodb className="w-4 h-4 text-[#47A248]" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide leading-tight uppercase font-mono">SQL & NoSQL</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 hover:text-[#FFD43B] transition-all duration-300 group/item">
                        <SiPython className="w-4 h-4 sm:w-5 sm:h-5 text-[#3776AB]" />
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">Python</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 hover:text-[#DEA584] transition-all duration-300 group/item">
                        <div className="flex gap-1.5">
                            <SiGo className="w-4 h-4 text-[#00ADD8]" />
                            <SiRust className="w-4 h-4 text-[#DEA584]" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">Go / Rust</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 hover:text-[#ED8B00] transition-all duration-300 group/item">
                        <SiOpenjdk className="w-4 h-4 sm:w-5 sm:h-5 text-[#ED8B00]" />
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">Java</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 hover:text-[#00599C] transition-all duration-300 group/item">
                        <div className="flex gap-1.5">
                            <SiC className="w-4 h-4 text-[#A8B9CC]" />
                            <SiCplusplus className="w-4 h-4 text-[#00599C]" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">C / C++</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 hover:text-[#2496ED] transition-all duration-300 group/item">
                        <div className="flex gap-1.5">
                            <SiDocker className="w-4 h-4 text-[#2496ED]" />
                            <SiAmazonwebservices className="w-4 h-4 text-[#FF9900]" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">Cloud & Docker</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 hover:text-[#3ECF8E] transition-all duration-300 group/item">
                        <SiSupabase className="w-4 h-4 sm:w-5 sm:h-5 text-[#3ECF8E]" />
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-mono">Supabase</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 hover:text-[#F05032] transition-all duration-300 group/item">
                        <div className="flex gap-1.5">
                            <SiGit className="w-4 h-4 text-[#F05032]" />
                            <SiPostman className="w-4 h-4 text-[#FF6C37]" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold tracking-wide leading-tight uppercase font-mono">Git & APIs</span>
                    </div>
                </div>

                {/* Right Area - Large spinning React icon */}
                <div className="flex-shrink-0 pt-4 pr-1 sm:pr-4">
                    <SiReact className="w-20 h-20 sm:w-28 sm:h-28 text-[#61DAFB]/10 rotate-12 transition-all duration-700 ease-in-out group-hover:text-[#61DAFB]/40 group-hover:animate-[spin_10s_linear_infinite] group-hover:drop-shadow-[0_0_15px_rgba(97,218,251,0.3)]" />
                </div>
            </div>
        </div>
    );
}
