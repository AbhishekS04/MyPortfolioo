"use client";

import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiSupabase, SiFigma } from "react-icons/si";

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
                <div className="space-y-4">
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <SiReact className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide">React & Next.js</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <SiTypescript className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide">TypeScript</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <SiTailwindcss className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide">Tailwind CSS</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <SiSupabase className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide">Supabase</span>
                    </div>
                </div>
            </div>

            {/* Subtle corner decoration */}
            <div className="absolute top-6 right-6 opacity-10">
                <SiReact className="w-24 h-24 rotate-12" />
            </div>
        </div>
    );
}
