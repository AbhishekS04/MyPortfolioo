"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/lib/data";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Strict type for Supabase response to avoid 'any'
interface SupabaseProject {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    image_url: string;
    slug: string;
    featured: boolean;
    display_order: number;
}

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
                        sizes="(max-width: 768px) 100vw, 50vw"
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

function ProjectCardSkeleton() {
    return (
        <div className="h-full bg-[#111111] border border-white/5 rounded-[24px] overflow-hidden flex flex-col">
            {/* Image Skeleton */}
            <div className="relative w-full aspect-[16/10] bg-white/5 animate-pulse" />

            {/* Content Skeleton */}
            <div className="p-6 flex flex-col flex-1 justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="h-7 w-1/2 bg-white/5 rounded-md animate-pulse" />
                        <div className="h-5 w-5 bg-white/5 rounded-md animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-white/5 rounded-md animate-pulse" />
                        <div className="h-4 w-2/3 bg-white/5 rounded-md animate-pulse" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-5 w-16 bg-white/5 rounded-full animate-pulse" />
                    <div className="h-5 w-12 bg-white/5 rounded-full animate-pulse" />
                    <div className="h-5 w-20 bg-white/5 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export function FeaturedProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

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
                    setHasError(true);
                } else if (data) {
                    // Safe type mapping
                    const mappedProjects: Project[] = (data as unknown as SupabaseProject[]).map((item) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        techStack: item.tech_stack || [],
                        image: item.image_url,
                        link: `/works/${item.slug}?from=home`,
                    }));
                    setProjects(mappedProjects);
                }
            } catch (err) {
                console.error("Unexpected error fetching projects", err);
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProjects();
    }, []);

    // Error State
    if (hasError) {
        return (
            <section className="py-20 flex justify-center text-white/40">
                <p>Unable to load contents</p>
            </section>
        );
    }

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
                {isLoading ? (
                    // Skeleton Loading State
                    <>
                        <ProjectCardSkeleton />
                        <ProjectCardSkeleton />
                    </>
                ) : (
                    // Real Data
                    projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <ProjectCard project={project} />
                        </motion.div>
                    ))
                )}
            </div>
        </section>
    );
}
