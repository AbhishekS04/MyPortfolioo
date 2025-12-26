"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { SocialIcons } from "@/components/ui/social-icons";
import { NavBar } from "@/components/ui/navbar";
import { CopyCode } from "@/components/ui/copy-code-button";
import { RatingInteraction } from "@/components/ui/emoji-rating";

export default function ContactPage() {
    // Email for the copy functionality
    const email = "callm@example.com";

    // Force re-render key for development consistency
    const devKey = process.env.NODE_ENV === "development" ? "contact-page-v1" : undefined;

    return (
        <main key={devKey} className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 relative overflow-x-hidden">
            <NavBar />

            <div className="relative z-10 px-6 md:px-12 max-w-[1200px] mx-auto pt-40 md:pt-48 pb-20 flex flex-col items-center md:items-start">

                {/* --- 1. Hero / Intro Block --- */}
                <header className="mb-12 md:mb-16 w-full max-w-4xl text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-6 leading-[1.05]">
                            Let’s build something <br />
                            <span className="text-white/40">meaningful.</span>
                        </h1>
                    </motion.div>

                    {/* --- 2. Availability Section --- */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-6 text-sm md:text-base font-light text-neutral-400"
                    >
                        <p>Currently accepting opportunities for:</p>
                        <ul className="flex flex-wrap justify-center gap-4 text-white/80">
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-emerald-500/80" />
                                Internships
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-emerald-500/80" />
                                Freelance
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-emerald-500/80" />
                                Consulting
                            </li>
                        </ul>
                    </motion.div>
                </header>


                {/* --- 3. Social + Copy Email Section (Contact Card) --- */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="mb-24 w-full md:w-auto"
                >
                    <div className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-sm mx-auto md:mx-0 w-fit">
                        {/* Socials */}
                        <div className="flex-shrink-0">
                            <SocialIcons />
                        </div>

                        {/* Divider for Desktop */}
                        <div className="hidden md:block w-px h-12 bg-white/10" />

                        {/* Copy Code */}
                        <div className="flex-shrink-0">
                            <CopyCode code={email} />
                        </div>
                    </div>
                </motion.section>


                {/* --- 4. Experience Rating Section --- */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-32 flex flex-col items-center md:items-start gap-4 w-full md:w-auto mx-auto md:mx-0"
                >
                    <span className="text-xs font-mono text-white/20 uppercase tracking-[0.2em] ml-2">Quick Feedback</span>
                    <div className="p-6 rounded-3xl bg-neutral-900/30 border border-white/5">
                        <RatingInteraction />
                    </div>
                </motion.section>


                {/* --- 5. Meta Info Strip --- */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="w-full border-t border-dashed border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 text-sm"
                >
                    {/* Location & Status Group */}
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-white/30 uppercase tracking-widest">Location</span>
                            <span className="font-light text-neutral-300">India</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-white/30 uppercase tracking-widest">Status</span>
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/20 border border-emerald-500/10">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-medium text-emerald-400/80 uppercase tracking-wide">Available</span>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-xs font-mono text-white/20 uppercase tracking-widest">
                        © {new Date().getFullYear()} Abhishek Singh
                    </div>
                </motion.footer>

            </div>
        </main>
    );
}
