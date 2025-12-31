"use client";

import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiSupabase, SiFigma, SiC, SiCplusplus, SiOpenjdk, SiPython, SiPostgresql, SiDocker, SiGo, SiRust, SiNodedotjs, SiMongodb, SiRedis, SiAmazonwebservices, SiGit, SiPostman } from "react-icons/si";

export function FocusCard() {
    return (
        <div className="w-full h-full bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden flex flex-col p-8 relative group hover:border-white/10 transition-colors">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Core Stack</span>
            </div>

            {/* Static Content - Generous Padding */}
            <div className="flex flex-col gap-4 h-full">
                <div className="space-y-3">
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <SiNextdotjs className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide">Next.js & React</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <div className="flex gap-2">
                            <SiNodedotjs className="w-5 h-5" />
                            <SiTypescript className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium tracking-wide">Node.js & TypeScript</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <SiTailwindcss className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide">Tailwind CSS & UI</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <div className="flex gap-2">
                            <SiPostgresql className="w-5 h-5" />
                            <SiMongodb className="w-5 h-5" />
                            <SiRedis className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium tracking-wide">SQL, NoSQL & Redis</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <SiPython className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide">Python</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <div className="flex gap-2">
                            <SiGo className="w-5 h-5" />
                            <SiRust className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium tracking-wide">Go / Rust</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <SiOpenjdk className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide">Java</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <div className="flex gap-2">
                            <SiC className="w-5 h-5" />
                            <SiCplusplus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium tracking-wide">C / C++</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <div className="flex gap-2">
                            <SiDocker className="w-5 h-5" />
                            <SiAmazonwebservices className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium tracking-wide">Cloud & Docker</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <SiSupabase className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide">Supabase & BaaS</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <div className="flex gap-2">
                            <SiGit className="w-5 h-5" />
                            <SiPostman className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium tracking-wide">Git & API Testing</span>
                    </div>
                </div>
            </div>

            {/* Subtle corner decoration */}
            <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
                <SiReact className="w-24 h-24 rotate-12 transition-transform duration-700 ease-in-out group-hover:animate-[spin_10s_linear_infinite]" />
            </div>
        </div>
    );
}
