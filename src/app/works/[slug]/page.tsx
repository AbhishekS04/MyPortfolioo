import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Github, ArrowUpRight, AlignLeft } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 0; // Dynamic rendering

interface WorksDetailProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getProject(slug: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

    return data;
}

export async function generateMetadata({ params }: WorksDetailProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) return { title: "Project Not Found" };
    return {
        title: `${project.title} - Case Study`,
        description: project.description,
    };
}

export default async function ProjectDetailPage({ params }: WorksDetailProps) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    // Helper for rendering line breaks properly
    const TextBlock = ({ text }: { text: string }) => {
        if (!text) return null;
        return (
            <div className="space-y-4 text-lg md:text-xl text-[#d4d4d4] leading-relaxed font-light break-words">
                {text.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-[#050505] text-[#ededed] selection:bg-emerald-500/30 selection:text-emerald-50 pb-40 overflow-x-hidden">

            {/* --- 1. Top Navigation --- */}
            <nav className="fixed top-0 z-50 w-full px-6 md:px-12 py-6 pointer-events-none">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between pointer-events-auto">
                    <Link
                        href="/works"
                        className="group flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors bg-black/50 backdrop-blur-xl px-4 py-2 rounded-full border border-white/5 hover:border-white/20 shadow-lg"
                    >
                        <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span>Back to Works</span>
                    </Link>
                </div>
            </nav>

            <article className="px-6 md:px-12 max-w-[1200px] mx-auto mt-16 md:mt-24">

                {/* --- 2. Header Meta Row --- */}
                <header className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards mb-12 sm:pt-20 pt-24">
                    <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm font-medium tracking-wide text-white/40 uppercase">
                        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                            <span className={`w-1.5 h-1.5 rounded-full ${project.project_type === 'Client' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                            {project.project_type === "Client" ? "Client Work" : "Personal Project"}
                        </span>
                        <span className="hidden sm:inline opacity-50">•</span>
                        <span>{new Date(project.created_at).getFullYear()}</span>
                        {project.client_name && (
                            <>
                                <span className="hidden sm:inline opacity-50">•</span>
                                <span>{project.client_name}</span>
                            </>
                        )}
                    </div>

                    {/* --- 3. Project Title & Summary --- */}
                    <div className="space-y-6 md:space-y-8">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95] max-w-5xl break-words">
                            {project.title}
                        </h1>

                        <div className="flex flex-col lg:flex-row lg:items-end gap-8 justify-between border-l-2 border-white/10 pl-6 md:pl-8 py-2">
                            <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light max-w-2xl break-words">
                                {project.description}
                            </p>

                            {/* Tech Stack - Flow layout */}
                            <div className="flex flex-wrap gap-2 max-w-md lg:justify-end">
                                {project.tech_stack?.map((tech: string) => (
                                    <span key={tech} className="px-3 py-1.5 rounded-md text-xs font-mono text-white/50 bg-[#111] border border-white/5">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- 4. Primary Media --- */}
                <section className="mb-24 md:mb-32">
                    <div className="group relative w-full rounded-[20px] md:rounded-[32px] overflow-hidden border border-white/10 bg-[#0F0F0F] aspect-[16/10] md:aspect-[21/9] shadow-2xl">
                        {project.media_mode === 'video_first' && project.video_url ? (
                            <video
                                src={project.video_url}
                                controls
                                className="w-full h-full object-cover"
                                poster={project.image_url}
                            />
                        ) : (
                            <Image
                                src={project.image_url}
                                alt={project.title}
                                fill
                                priority
                                className="object-cover"
                            />
                        )}
                        {/* Glass Overlay for sheen */}
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[inherit] pointer-events-none" />
                    </div>
                </section>

                {/* --- 5. Content Grid (Resilient Flow) --- */}
                {/* 
                    Using simple Flex/Grid logic that wraps naturally.
                    Desktop: Main Content (Left), Key Highlights (Right).
                    Mobile: Stacked.
                 */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-32">

                    {/* LEFT: Text Content */}
                    <div className="flex-1 min-w-0 space-y-24">

                        {/* Overview */}
                        {project.overview && (
                            <section>
                                <h3 className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4 w-fit">
                                    <AlignLeft className="w-4 h-4 text-emerald-500" />
                                    Project Overview
                                </h3>
                                <TextBlock text={project.overview} />
                            </section>
                        )}

                        {/* Problems */}
                        {project.problem_statement && (
                            <section>
                                <h3 className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4 w-fit">
                                    <span className="text-emerald-500">01.</span>
                                    The Challenge
                                </h3>
                                <TextBlock text={project.problem_statement} />
                            </section>
                        )}

                        {/* Approach */}
                        {project.approach && (
                            <section>
                                <h3 className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4 w-fit">
                                    <span className="text-emerald-500">02.</span>
                                    The Approach
                                </h3>
                                <TextBlock text={project.approach} />
                            </section>
                        )}

                        {/* Outcome */}
                        {project.outcome && (
                            <section className="p-8 md:p-10 rounded-[24px] bg-[#0E0E0E] border border-white/5 shadow-lg">
                                <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">
                                    Outcome & Results
                                </h3>
                                <div className="text-xl md:text-2xl text-white font-medium leading-normal">
                                    "{project.outcome}"
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT: Key Highlights & Actions */}
                    <div className="lg:w-[360px] flex-shrink-0 space-y-12 min-w-0">

                        {/* Highlights Card */}
                        {project.features && (
                            <div className="rounded-[24px] bg-[#0F0F0F] border border-white/10 p-8 shadow-xl">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/5">
                                    Key Highlights
                                </h3>
                                <ul className="space-y-4">
                                    {project.features.split('\n').filter(Boolean).map((feature: string, i: number) => (
                                        <li key={i} className="flex gap-4 text-sm md:text-base text-white/70 leading-relaxed break-words">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                            <span>{feature.replace(/^•\s*/, '')}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sticky top-24">
                            {(project.external_link_url || (project.project_url && project.project_url.startsWith('http'))) && (
                                <a
                                    href={project.external_link_url || project.project_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 rounded-xl bg-white text-black font-bold text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-white/25 flex items-center justify-center gap-2"
                                >
                                    <span>{project.external_link_label || "Live Demo"}</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </a>
                            )}
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 rounded-xl bg-[#111] border border-white/10 text-white font-medium text-center hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Github className="w-4 h-4" />
                                    <span>Source Code</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- 6. Media Gallery --- */}
                {project.gallery_images && project.gallery_images.length > 0 && (
                    <section className="mb-32 space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="h-px flex-1 bg-white/10" />
                            <span className="text-xs font-mono text-white/30 uppercase tracking-widest">Gallery</span>
                            <span className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Auto-fill Grid - Extremely resilient */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {project.gallery_images.map((img: string, idx: number) => (
                                <div key={idx} className={`relative rounded-[24px] overflow-hidden border border-white/5 bg-[#0F0F0F] shadow-lg group ${idx === 0 && project.gallery_images.length % 2 !== 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/3] md:aspect-video'}`}>
                                    <Image
                                        src={img}
                                        alt={`Gallery ${idx}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t border-white/10 pt-12 text-center">
                    <p className="text-white/30 text-sm font-mono">{project.title} — {new Date(project.created_at).getFullYear()}</p>
                </footer>

            </article>
        </main>
    );
}
