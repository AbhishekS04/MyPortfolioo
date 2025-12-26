"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FEATURED_PROJECTS, Project } from "@/lib/data";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function ProjectCard({ project }: { project: Project }) {
    return (
        <Link href={project.link} className="group block h-full">
            <div className="relative h-full bg-[#111111] border border-white/5 rounded-[24px] overflow-hidden transition-colors duration-500 hover:border-white/10 flex flex-col group-hover:bg-[#161616]">
                {/* Image Container */}
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-[0.25,1,0.5,1] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                        <div className="flex items-start justify-between">
                            <h3 className="text-xl font-medium text-white/90 group-hover:text-white transition-colors">
                                {project.title}
                            </h3>
                            <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                        <p className="mt-2 text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors line-clamp-2">
                            {project.description}
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium bg-white/5 text-white/40 border border-white/5"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function FeaturedProjects() {
    const [projects, setProjects] = useState<Project[]>(FEATURED_PROJECTS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('featured', true)
                    .order('display_order', { ascending: true });

                if (error) {
                    console.error('Error fetching projects:', error);
                    // Fallback to static data on error
                    setProjects(FEATURED_PROJECTS);
                } else if (data && data.length > 0) {
                    // Map DB keys to frontend Project interface
                    const mappedProjects: Project[] = data.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        techStack: item.tech_stack || [],
                        image: item.image_url,
                        link: `/works/${item.slug}`,
                    }));
                    setProjects(mappedProjects);
                } else {
                    // no data found, fallback
                    setProjects(FEATURED_PROJECTS);
                }
            } catch (err) {
                console.error("Unexpected error fetching projects", err);
                setProjects(FEATURED_PROJECTS);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProjects();
    }, []);

    // While loading, we could show skeletons, but for now we'll just show nothing or the previous state
    // Since we fallback to static data, we can just render whatever is in `projects`

    // Safety check: if projects is empty (e.g. initial render before effect), render nothing or skeletons.
    // However, if we initialize with empty array, user sees nothing briefly.
    // Let's initialize with empty and wait for fetch.

    if (isLoading) {
        // Optional: Add a subtle loading state or just return null to avoid layout shift
        // But for a portfolio, immediate static content is often better.
        // Given "Premium" requirement, a skeleton or smooth fade in is best.
        // reusing the motion.div below handles the fade in.
    }

    const projectsToDisplay = projects.length > 0 ? projects : FEATURED_PROJECTS;

    return (
        <section id="featured-projects" className="py-20">

            {/* Section Header */}
            <div className="flex items-center justify-between mb-12 px-2">
                <h2 className="text-3xl md:text-4xl font-medium text-white/90">
                    Selected Works
                </h2>
                <Link
                    href="/works"
                    className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm md:text-base"
                >
                    <span>View All</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <ProjectCard project={project} />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
