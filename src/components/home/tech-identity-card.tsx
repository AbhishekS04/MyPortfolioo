"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SiCplusplus, SiHtml5, SiCss3, SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiBootstrap, SiTailwindcss, SiNodedotjs, SiPython, SiRust, SiGo, SiMongodb, SiPostgresql, SiSupabase, SiFigma, SiDocker, SiGit } from "react-icons/si";
import { FaJava } from "react-icons/fa";

const ICONS: Record<string, React.ReactNode> = {
    "cpp": <SiCplusplus className="w-full h-full" />,
    "java": <FaJava className="w-full h-full" />,
    "html": <SiHtml5 className="w-full h-full" />,
    "css": <SiCss3 className="w-full h-full" />,
    "js": <SiJavascript className="w-full h-full" />,
    "ts": <SiTypescript className="w-full h-full" />,
    "react": <SiReact className="w-full h-full" />,
    "next": <SiNextdotjs className="w-full h-full" />,
    "bootstrap": <SiBootstrap className="w-full h-full" />,
    "tailwind": <SiTailwindcss className="w-full h-full" />,
    "node": <SiNodedotjs className="w-full h-full" />,
    "python": <SiPython className="w-full h-full" />,
    "rust": <SiRust className="w-full h-full" />,
    "go": <SiGo className="w-full h-full" />,
    "mongodb": <SiMongodb className="w-full h-full" />,
    "postgresql": <SiPostgresql className="w-full h-full" />,
    "supabase": <SiSupabase className="w-full h-full" />,
    "figma": <SiFigma className="w-full h-full" />,
    "docker": <SiDocker className="w-full h-full" />,
    "git": <SiGit className="w-full h-full" />,
};

const FALLBACK_KEYS = ["react", "next", "ts", "js", "html", "css"];

export function TechIdentityCard() {
    const [keys, setKeys] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase
                .from("tech_stack")
                .select("icon_key")
                .order("display_order", { ascending: true });

            if (data && data.length > 0) {
                setKeys(data.map(item => item.icon_key).filter(k => ICONS[k]));
            } else {
                setKeys(FALLBACK_KEYS);
            }
        };
        fetchData();
    }, []);

    const displayKeys = keys.length > 0 ? keys : FALLBACK_KEYS;

    return (
        <div className="w-full h-40 bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden relative flex flex-col justify-between p-6 group">
            <div className="z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium uppercase tracking-widest text-white/40">Tech Stack</span>
                </div>
            </div>

            <div className="flex overflow-hidden w-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 mt-2 absolute bottom-6 left-0 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    className="flex gap-12 md:gap-16 flex-shrink-0 items-center px-6"
                >
                    {[...displayKeys, ...displayKeys].map((key, index) => (
                        <div key={`${key}-${index}`} className="w-8 h-8 flex-shrink-0 text-white/40 hover:text-white transition-colors duration-500">
                            {ICONS[key]}
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
    );
}
