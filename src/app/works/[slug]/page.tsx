import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Github, ArrowUpRight, AlignLeft, Layers, Cpu, Globe, Users } from "lucide-react";
import ProjectContributors from "@/components/ui/project-contributors";
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

    const { data: contributors } = await (await createClient())
        .from("project_contributors")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: true });

    // Helper for rendering line breaks properly
    const TextBlock = ({ text }: { text: string }) => {
        if (!text) return null;
        return (
            <div className="space-y-6 text-lg md:text-xl text-[#d4d4d4] leading-relaxed font-light break-words min-w-0">
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
                <div className="max-w-[1280px] mx-auto flex items-center justify-between pointer-events-auto">
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

            <article className="px-6 md:px-12 max-w-[1280px] mx-auto mt-24 md:mt-32">

                {/* --- 2. Header Meta Row --- */}
                <header className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards mb-16 md:mb-24">
                    <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm font-medium tracking-wide text-white/40 uppercase">
                        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                            <span className={`w-1.5 h-1.5 rounded-full ${project.project_type === 'Client' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                            {project.project_type === "Client" ? "Client Work" : "Personal Project"}
                        </span>
                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/10" />
                        <span>{new Date(project.created_at).getFullYear()}</span>
                        {project.client_name && (
                            <>
                                <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/10" />
                                <span>{project.client_name}</span>
                            </>
                        )}
                    </div>

                    {/* --- 3. Project Title & Summary --- */}
                    <div className="space-y-8 md:space-y-12">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95] max-w-6xl break-words">
                            {project.title}
                        </h1>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-white/10 pt-10">
                            {/* Description */}
                            <div className="lg:col-span-8">
                                <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light break-words">
                                    {project.description}
                                </p>
                            </div>

                            {/* Tech Stack */}
                            <div className="lg:col-span-4 flex flex-wrap content-start gap-2">
                                {project.tech_stack?.map((tech: string) => (
                                    <span key={tech} className="px-3 py-1.5 rounded-lg text-xs font-mono text-white/60 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- 4. Primary Media --- */}
                <section className="mb-24 md:mb-32">
                    <div className="group relative w-full rounded-[24px] md:rounded-[40px] overflow-hidden border border-white/10 bg-[#0F0F0F] aspect-[16/10] md:aspect-[21/9] shadow-2xl ring-1 ring-white/5">
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
                        {/* Inner stroke for polish */}
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[inherit] pointer-events-none" />
                    </div>
                </section>

                {/* --- 5. Content Grid (Resilient Layout) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-32 relative">

                    {/* LEFT COLUMN: Main Narrative (8 cols) */}
                    <div className="lg:col-span-8 space-y-24 min-w-0">

                        {/* Overview */}
                        {project.overview && (
                            <section>
                                <div className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest mb-8 text-white/40">
                                    <AlignLeft className="w-4 h-4" />
                                    <span>Overview</span>
                                </div>
                                <TextBlock text={project.overview} />
                            </section>
                        )}

                        {/* The Challenge */}
                        {project.problem_statement && (
                            <section>
                                <div className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest mb-8 text-white/40">
                                    <span className="text-emerald-500">01.</span>
                                    <span>The Challenge</span>
                                </div>
                                <TextBlock text={project.problem_statement} />
                            </section>
                        )}

                        {/* The Approach */}
                        {project.approach && (
                            <section>
                                <div className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest mb-8 text-white/40">
                                    <span className="text-emerald-500">02.</span>
                                    <span>The Approach</span>
                                </div>
                                <TextBlock text={project.approach} />
                            </section>
                        )}

                        {/* Outcome & Results Badge */}
                        {project.outcome && (
                            <section className="p-8 md:p-12 rounded-[32px] bg-gradient-to-br from-[#111] to-black border border-white/10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/15 transition-colors duration-700" />

                                <h3 className="relative text-xs font-bold text-emerald-500 uppercase tracking-widest mb-6">
                                    Outcome & Learning
                                </h3>
                                <div className="relative text-xl md:text-2xl text-white font-medium leading-relaxed">
                                    "{project.outcome}"
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Sticky Sidebar (4 cols) */}
                    <aside className="lg:col-span-4 relative">
                        <div className="sticky top-32 space-y-10">

                            {/* Features Card */}
                            {project.features && (
                                <div className="rounded-[28px] bg-[#111] border border-white/10 p-8 shadow-xl">
                                    <div className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest mb-6 pb-6 border-b border-white/5">
                                        <Layers className="w-4 h-4 text-emerald-500" />
                                        <span>Key Highlights</span>
                                    </div>
                                    <ul className="space-y-4">
                                        {project.features.split('\n').filter(Boolean).map((feature: string, i: number) => (
                                            <li key={i} className="flex gap-4 text-sm md:text-base text-white/70 leading-relaxed font-light group">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-500 shrink-0 transition-colors" />
                                                <span>{feature.replace(/^•\s*/, '')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Contributors Card */}
                            {contributors && contributors.length > 0 && (
                                <div className="rounded-[28px] bg-[#111] border border-white/10 p-8 shadow-xl">
                                    <div className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-widest mb-6 pb-6 border-b border-white/5">
                                        <Users className="w-4 h-4 text-emerald-500" />
                                        <span>Contributors</span>
                                    </div>
                                    <ProjectContributors
                                        contributors={contributors.map((c: any) => ({
                                            name: c.name,
                                            avatar_url: c.avatar_url,
                                            role: c.role,
                                            social_url: c.social_url,
                                            fallback: c.name.substring(0, 2).toUpperCase()
                                        }))}
                                    />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                {(project.external_link_url || (project.project_url && project.project_url.startsWith('http'))) && (
                                    <a
                                        href={project.external_link_url || project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 rounded-2xl bg-white text-black font-bold text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-3 group"
                                    >
                                        <span>{project.external_link_label || "View Live Project"}</span>
                                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                )}
                                {project.github_url && (
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 rounded-2xl bg-[#111] border border-white/10 text-white font-medium text-center hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                        <span>View Source Code</span>
                                    </a>
                                )}
                            </div>

                        </div>
                    </aside>
                </div>

                {/* --- 6. Media Gallery --- */}
                {project.gallery_images && project.gallery_images.length > 0 && (
                    <section className="mb-40 space-y-12">
                        <div className="flex items-center gap-6">
                            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <span className="text-xs font-mono text-white/30 uppercase tracking-[0.2em]">Project Gallery</span>
                            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        {/* Masonry-like Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {project.gallery_images.map((img: string, idx: number) => (
                                <div
                                    key={idx}
                                    className={`relative rounded-[24px] md:rounded-[32px] overflow-hidden border border-white/5 bg-[#0F0F0F] shadow-lg group ${
                                        // Specific logic to span odd items or make the first one huge if desired
                                        idx === 0 && project.gallery_images.length % 2 !== 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3] md:aspect-[3/2]'
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Gallery ${idx}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer Navigation */}
                <footer className="border-t border-white/10 pt-16 pb-8 text-center">
                    <Link
                        href="/works"
                        className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors duration-300"
                    >
                        <span className="text-sm font-mono uppercase tracking-widest">Back to All Projects</span>
                    </Link>
                </footer>

            </article>
        </main>
    );
}
