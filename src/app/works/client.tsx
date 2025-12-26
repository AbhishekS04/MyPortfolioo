"use client";

import { motion } from "framer-motion";
import { CurrentlyWorkingCard } from "@/components/works/currently-working-card";
import { ProjectGrid } from "@/components/works/project-grid";

import { Project } from "@/types/project";

export function WorksClient({ projects }: { projects: Project[] }) {
    const currentlyWorking = projects.find(p => p.is_currently_working);
    const otherProjects = projects.filter(p => !p.is_currently_working);

    return (
        <main className="min-h-screen pt-32 px-4 md:px-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[1400px] mx-auto"
            >
                {/* 1. Currently Working Section */}
                {currentlyWorking && (
                    <section>
                        <CurrentlyWorkingCard project={currentlyWorking} />
                    </section>
                )}

                {/* 2. All Projects Section */}
                {otherProjects.length > 0 && (
                    <section>
                        <ProjectGrid projects={otherProjects} />
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
