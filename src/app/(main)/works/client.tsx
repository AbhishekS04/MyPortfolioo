"use client";

import { motion } from "framer-motion";
import { CurrentlyWorkingCard } from "@/components/works/currently-working-card";
import { ProjectGrid } from "@/components/works/project-grid";
import Link from "next/link";

import { Project } from "@/types/project";

export function WorksClient({ projects }: { projects: Project[] }) {
    const currentlyWorking = projects.find(p => p.is_currently_working);
    const otherProjects = projects.filter(p => !p.is_currently_working);

    return (
        <main className="min-h-screen bg-[#050505] pt-32 px-6 md:px-12 pb-20 selection:bg-emerald-500/30 selection:text-emerald-50">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[1280px] mx-auto space-y-24"
            >
                {/* Back to Minimal Button (Conditional) */}
                {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get("from") === "minimal" && (
                    <div className="mb-8">
                        <Link href="/minimal" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                            <span className="block border-b border-white/20 pb-0.5 group-hover:border-white transition-colors">← Back to Minimal</span>
                        </Link>
                    </div>
                )}

                {/* 1. Currently Working Section */}
                {currentlyWorking && (
                    <section>
                        <CurrentlyWorkingCard project={currentlyWorking} />
                    </section>
                )}

                {/* 2. All Projects Section */}
                {projects.length > 0 && (
                    <section>
                        <ProjectGrid projects={projects} />
                    </section>
                )}

                {/* Empty State */}
                {!projects.length && (
                    <div className="text-center text-white/40 py-20">
                        <p>No projects found. Use the Admin panel to add your works.</p>
                    </div>
                )}
            </motion.div>
        </main>
    );
}
