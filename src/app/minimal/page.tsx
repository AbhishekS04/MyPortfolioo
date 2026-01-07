"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Circle, Mail, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

// Types
interface HelperProject {
    id: string;
    title: string;
    description: string;
    tech_stack: string[]; // Supabase returns this
    slug: string;
    image_url: string;
    link?: string; // Optional if we construct it
}

export default function MinimalPage() {
    const [projects, setProjects] = useState<HelperProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('featured', true)
                    .order('display_order', { ascending: true });

                if (error) throw error;
                if (data) {
                    setProjects(data as HelperProject[]);
                }
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProjects();
    }, []);

    return (
        <main className="min-h-screen bg-[#050505] text-[#e1e1e1] font-sans selection:bg-white/20 pb-32">
            {/* 
              This page intentionally uses a constrained width and simple stacking 
              to ensure "super responsiveness" and high readability.
            */}
            <div className="max-w-4xl mx-auto px-6 pt-32 md:pt-48">

                {/* --- Header / Bio Section --- */}
                <header className="mb-20 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mr-14">
                        <div className="flex items-center gap-4">
                            {/* Placeholder for Profile Image - Assuming simple circle */}
                            <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden relative border border-white/5">
                                <Image
                                    src="https://res.cloudinary.com/dap0u41dz/image/upload/v1766771167/file_00000000d51472078b7e2f9d883a6674_majhmb.jpg"
                                    alt="Abhishek"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-medium text-white tracking-tight">Abhishek Singh</h1>
                                <div className="flex items-center gap-2 text-sm text-white/50 mt-1">
                                    <span className="flex items-center gap-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        Available for work
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> India
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Resume Button */}
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium text-white/80 hover:text-white"
                        >
                            View Resume
                        </a>
                    </div>

                    <div className="space-y-4 text-lg md:text-xl leading-relaxed text-white/70">
                        <p>
                            Product Engineer and Full Stack Developer.
                            I build pixel-perfect, engaging, and accessible digital experiences.
                            Currently focused on React, Next.js, and refined motion design.
                        </p>
                    </div>

                    {/* Tech Stack - Simple List */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/40 font-mono">
                        <span>React</span>
                        <span>Next.js</span>
                        <span>TypeScript</span>
                        <span>Tailwind</span>
                        <span>Supabase</span>
                        <span>Motion</span>
                    </div>
                </header>

                <hr className="border-white/5 mb-20" />

                {/* --- Works Section --- */}
                <section className="space-y-12">
                    <h2 className="text-sm font-mono text-white/30 uppercase tracking-widest">Selected Works</h2>

                    <div className="space-y-8">
                        {isLoading ? (
                            <div className="text-white/30 text-sm animate-pulse">Loading works...</div>
                        ) : projects.length === 0 ? (
                            <div className="text-white/30 text-sm">No projects found.</div>
                        ) : (
                            <>
                                {projects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/works/${project.slug}?from=minimal`}
                                        className="block group"
                                    >
                                        <article className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-8">
                                            <h3 className="text-lg font-medium text-white/90 group-hover:text-white group-hover:underline decoration-1 underline-offset-4 transition-all">
                                                {project.title}
                                            </h3>

                                            <div className="flex bg-dots flex-1 mx-2 opacity-20 border-b border-dashed border-white/30 relative top-[-6px] hidden sm:block"></div>

                                            <p className="text-sm text-white/50 font-mono shrink-0 group-hover:text-white/70 transition-colors">
                                                {/* Display Year or Tech? Let's go with Tech for context */}
                                                {project.tech_stack?.[0]}
                                            </p>
                                        </article>
                                        <p className="mt-1 text-sm text-white/40 sm:hidden">
                                            {project.tech_stack?.join(" · ")}
                                        </p>
                                    </Link>
                                ))}

                                {/* Show All Button */}
                                <div className="pt-8 flex justify-center sm:justify-start">
                                    <Link
                                        href="/works?from=minimal"
                                        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group"
                                    >
                                        <span>Show All Projects</span>
                                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* --- Footer / Contact --- */}
                <footer className="mt-32 pb-12 border-t border-white/5 pt-12">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm font-mono text-white/30 uppercase tracking-widest">Connect</h2>
                        <div className="flex gap-6 text-sm">
                            <a href="mailto:abhishek23main@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email
                            </a>
                            <a href="https://github.com/abhisheks04" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                GitHub
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                Twitter
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 text-xs text-white/20">
                        © {new Date().getFullYear()} Abhishek Singh. All rights reserved.
                    </div>
                </footer>

            </div>
        </main>
    );
}
