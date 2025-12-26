"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Project } from "@/types/project";

interface StatusConfigItem {
    width: string;
    color: string;
    glow: string;
    animate: boolean;
    pulseDuration?: number;
}

const statusConfig: Record<string, StatusConfigItem> = {
    'Not Started': {
        width: '5%',
        color: 'bg-white/10',
        glow: 'shadow-none',
        animate: false
    },
    'In Progress': {
        width: '45%',
        color: 'bg-yellow-500',
        glow: 'shadow-[0_0_15px_rgba(234,179,8,0.4)]',
        animate: true,
        pulseDuration: 3
    },
    'Near Completion': {
        width: '85%',
        color: 'bg-emerald-400',
        glow: 'shadow-[0_0_20px_rgba(52,211,153,0.5)]',
        animate: true,
        pulseDuration: 1.5
    },
    'Completed': {
        width: '100%',
        color: 'bg-blue-500',
        glow: 'shadow-none',
        animate: false
    }
};

export function CurrentlyWorkingCard({ project }: { project: Project }) {
    const config = statusConfig[project.status] || statusConfig['Not Started'];

    return (
        <div className="w-full flex justify-center mb-24">
            <div className="w-full max-w-[1200px]">
                <div className="flex items-center gap-3 mb-6 pl-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">Currently Working</span>
                </div>

                <Link href={project.project_url} className="block group">
                    <div className="relative w-full bg-[#111] rounded-[40px] border border-white/5 overflow-hidden flex flex-col md:flex-row hover:border-white/10 transition-colors duration-500 min-h-[400px]">

                        {/* LEFT: Image Preview */}
                        <div className="w-full md:w-[55%] h-[300px] md:h-auto relative bg-black/50 overflow-hidden">
                            <Image
                                src={project.image_url}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Inner Shadow Overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#111]" />
                        </div>

                        {/* RIGHT: Project Info */}
                        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative">
                            {/* Content */}
                            <div className="space-y-6 z-10">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight group-hover:text-blue-200/90 transition-colors">
                                        {project.title}
                                    </h2>
                                    <p className="text-lg text-white/50 leading-relaxed max-w-md">
                                        {project.description}
                                    </p>
                                </div>

                                {/* Tech Stack Chips */}
                                <div className="flex flex-wrap gap-2">
                                    {project.tech_stack.slice(0, 4).map((tech, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-white/60 font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px bg-white/5 my-4" />

                                {/* Progress Section */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs font-medium uppercase tracking-widest text-white/30">
                                        <span>Progress</span>
                                        <span className={config.animate ? "text-white" : ""}>{project.status}</span>
                                    </div>

                                    {/* Bar Container */}
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                                        {/* Animated Fill */}
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: config.width }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`h-full rounded-full ${config.color} ${config.glow}`}
                                            viewport={{ once: true }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Arrow Icon */}
                            <div className="absolute top-8 right-8 text-white/20 group-hover:text-white transition-colors">
                                <ArrowUpRight className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
