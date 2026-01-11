"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, Variants } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { FaGithub, FaTerminal } from "react-icons/fa6";
import ProjectContributors from "@/components/ui/project-contributors";
import { ChangelogOverlay } from "./changelog-overlay";
import { ImageZoomOverlay } from "@/components/ui/image-zoom-overlay";
import { useSearchParams } from "next/navigation";

interface Contributor {
    name: string;
    avatar_url: string;
    role: string;
    social_url?: string;
}

interface ProjectDetailsViewProps {
    project: any;
    contributors?: Contributor[];
}

function CustomVideoPlayer({ videoUrl, posterUrl }: { videoUrl: string, posterUrl: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false); // Default unmuted since it's user initiated? Or default muted? Let's default unmuted but handle autoplay policies if needed. Actually, for manual play, unmuted is fine.
    const [progress, setProgress] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const clickedValue = (x / rect.width) * videoRef.current.duration;
        videoRef.current.currentTime = clickedValue;
    };

    // Auto-hide controls when playing and not hovered
    const showControls = !isPlaying || isHovered;

    return (
        <div
            className="relative w-full h-full group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={togglePlay}
        >
            <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                playsInline
            />

            {/* Overlay Gradient for contrast */}
            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} />

            {/* Center Play Button (Only show when paused or hovered? User said minimal. Usually big play button hides when playing) */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${!isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white translate-x-0.5" />
                </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className={`absolute bottom-0 inset-x-0 p-4 md:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                <div className="flex items-center gap-4">

                    {/* Tiny Play/Pause for bottom bar */}
                    <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white/80 hover:text-white transition-colors">
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    {/* Progress Bar */}
                    <div
                        className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all"
                        onClick={handleSeek}
                    >
                        <div
                            className="h-full bg-blue-400/80 rounded-full relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-200 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] opacity-0 group-hover:opacity-100" />
                        </div>
                    </div>

                    {/* Mute Toggle */}
                    <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ProjectDetailsView({ project, contributors }: ProjectDetailsViewProps) {
    const { scrollY } = useScroll();
    const [showBottomNav, setShowBottomNav] = useState(false);
    const [showChangelog, setShowChangelog] = useState(false);
    const [zoomImage, setZoomImage] = useState<string | null>(null);
    const mediaRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();

    const fromMinimal = searchParams.get('from') === 'minimal';

    // Show mobile bottom nav only after scrolling past the hero
    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 500) {
            setShowBottomNav(true);
        } else {
            setShowBottomNav(false);
        }
    });

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const TextBlock = ({ text }: { text: string }) => {
        if (!text) return null;
        return (
            <div className="space-y-6 text-lg md:text-xl text-[#c0c0c0] leading-relaxed font-light break-words min-w-0">
                {text.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
            </div>
        );
    };

    return (
        <main className="relative min-h-screen bg-transparent text-[#e5e5e5] selection:bg-emerald-500/20 selection:text-emerald-100 pb-40 overflow-x-hidden">

            {/* --- Subtle Ambient Glow (Luxury/Fog) - Updated to Green Tones --- */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] bg-emerald-900/[0.03] rounded-full blur-[150px] mix-blend-screen opacity-40" />
                <div className="absolute top-[30%] -right-[10%] w-[60vw] h-[60vw] bg-teal-900/[0.02] rounded-full blur-[120px] mix-blend-screen opacity-30" />
            </div>

            {/* --- 1. Top Navigation (Fixed) --- */}
            <motion.nav
                className="fixed top-24 md:top-28 left-6 md:left-10 z-[60] pointer-events-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <Link
                    href={
                        fromMinimal ? "/minimal" :
                            searchParams.get('from') === 'home' ? "/" :
                                "/works"
                    }
                    className="group inline-flex items-center gap-3 p-3 md:px-5 md:py-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md transition-all duration-500 hover:border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                >
                    <ArrowLeft className="w-4 h-4 text-white/60 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="hidden md:inline text-sm font-medium text-white/80 tracking-wide group-hover:text-white transition-colors">
                        {fromMinimal ? "Back to Minimal" : searchParams.get('from') === 'home' ? "Back to Home" : "Back to Works"}
                    </span>
                </Link>
            </motion.nav>

            <article className="relative z-10 max-w-[1400px] mx-auto pt-32 md:pt-48 px-6 md:px-12 lg:px-20">

                {/* --- 2. Hero Section --- */}
                <motion.header
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="mb-24 md:mb-32 space-y-12"
                >
                    {/* Meta Row */}
                    <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 text-xs font-medium tracking-[0.2em] uppercase text-white/40">
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                            {project.project_type === "Client" ? "Client Work" : "Personal"}
                        </span>
                        <span className="opacity-30">/</span>
                        <span>{new Date(project.created_at).getFullYear()}</span>
                        {project.client_name && (
                            <>
                                <span className="opacity-30">/</span>
                                <span>{project.client_name}</span>
                            </>
                        )}
                    </motion.div>

                    {/* Title */}
                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tighter text-white leading-[0.95] max-w-6xl">
                        {project.title}
                    </motion.h1>

                    <motion.div variants={fadeInUp} className="w-full h-px bg-gradient-to-r from-blue-500/30 via-white/5 to-transparent mt-16 mb-16" />

                    <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                        <div className="lg:col-span-7">
                            <p className="text-xl md:text-3xl text-[#d4d4d4] leading-relaxed font-light max-w-prose">
                                {project.description}
                            </p>
                        </div>
                        <div className="lg:col-span-5 flex flex-wrap content-start gap-2">
                            {project.tech_stack?.map((tech: string) => (
                                <span key={tech} className="px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase text-blue-100/60 bg-blue-900/10 border border-blue-500/10 backdrop-blur-sm">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </motion.header>

                {/* --- 3. Primary Media (Cinematic & Clean) --- */}
                <motion.section
                    ref={mediaRef}
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-32 md:mb-48 w-full group relative"
                >
                    {/* Subtle Atmospheric Glow */}
                    <div className="absolute inset-x-0 -bottom-20 h-40 bg-blue-500/[0.03] blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative w-full overflow-hidden rounded-3xl bg-[#0a0a0a] shadow-2xl ring-1 ring-white/10">
                        {project.media_mode === 'video_first' && project.video_url ? (
                            <div className="relative w-full aspect-video">
                                <CustomVideoPlayer videoUrl={project.video_url} posterUrl={project.image_url} />
                            </div>
                        ) : (
                            <div className="relative w-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    onClick={() => setZoomImage(project.image_url)}
                                    className="w-full h-auto object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.01] cursor-zoom-in"
                                />
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* --- 4. Content Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-32 relative">

                    {/* LEFT: Deep Dive */}
                    <div className="lg:col-span-7 space-y-24 md:space-y-32">
                        {[
                            { title: 'Overview', number: '01', content: project.overview },
                            { title: 'The Challenge', number: '02', content: project.problem_statement },
                            { title: 'Approach', number: '03', content: project.approach }
                        ].map((section, idx) => (
                            section.content && (
                                <motion.section
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="flex items-center gap-4 mb-8 opacity-80">
                                        <span className="text-xs font-mono text-blue-300">{section.number}</span>
                                        <div className="h-px w-8 bg-blue-500/30" />
                                        <h3 className="text-xs font-bold text-blue-200 uppercase tracking-[0.2em]">{section.title}</h3>
                                    </div>
                                    <TextBlock text={section.content} />
                                </motion.section>
                            )
                        ))}

                        {project.outcome && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative py-12 border-t border-white/10"
                            >
                                <h3 className="text-xs font-bold text-blue-200 uppercase tracking-[0.2em] mb-8">Outcome</h3>
                                <p className="text-xl md:text-2xl text-white/90 font-light italic leading-relaxed">
                                    "{project.outcome}"
                                </p>
                            </motion.section>
                        )}
                    </div>

                    {/* RIGHT: Supporting Info (Sticky) */}
                    <aside className="lg:col-span-4 lg:col-start-9 h-fit lg:sticky lg:top-32 space-y-16">

                        {/* Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col gap-4"
                        >
                            {(project.external_link_url || (project.project_url && project.project_url.startsWith('http'))) && (
                                <a
                                    href={project.external_link_url || project.project_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-full py-5 px-6 border-b border-white/20 hover:border-white transition-colors flex items-center justify-between"
                                >
                                    <span className="text-lg font-medium tracking-tight">Visit Live Site</span>
                                    <ArrowUpRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                </a>
                            )}
                            {project.github_url && (
                                <>
                                    <a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group w-full py-5 px-6 border-b border-white/10 hover:border-white/40 transition-colors flex items-center justify-between text-white/50 hover:text-white"
                                    >
                                        <span className="text-sm font-medium tracking-wide">Source Code</span>
                                        <FaGithub className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all duration-300" />
                                    </a>

                                    <button
                                        onClick={() => setShowChangelog(true)}
                                        className="group w-full py-5 px-6 border-b border-white/10 hover:border-emerald-500/40 transition-colors flex items-center justify-between text-white/50 hover:text-emerald-400"
                                    >
                                        <span className="text-sm font-medium tracking-wide">View Change Log</span>
                                        <FaTerminal className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:rotate-[-10deg] transition-all" />
                                    </button>
                                </>
                            )}
                        </motion.div>

                        {/* Features */}
                        {project.features && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="border-t border-white/5"
                            >
                                <h4 className="px-6 py-4 text-xs font-bold text-blue-200/80 uppercase tracking-[0.2em] border-b border-white/5">Highlights</h4>
                                <ul className="px-6 py-6 space-y-3">
                                    {project.features.split('\n').filter(Boolean).map((feature: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-sm text-neutral-400 leading-relaxed font-light">
                                            <span className="text-blue-400/60 mt-1.5">•</span>
                                            <span>{feature.replace(/^•\s*/, '')}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {/* Contributors */}
                        {contributors && contributors.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="border-t border-white/5"
                            >
                                <h4 className="px-6 py-4 text-xs font-bold text-blue-200/80 uppercase tracking-[0.2em] border-b border-white/5">Team</h4>
                                <div className="px-6 py-6">
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
                            </motion.div>
                        )}
                    </aside>
                </div>

                {/* --- 5. Gallery --- */}
                {project.gallery_images && project.gallery_images.length > 0 && (
                    <section className="mb-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end"
                        >
                            <h2 className="text-2xl font-light text-white">Project Gallery</h2>
                            <span className="text-xs font-mono text-white/30">0{project.gallery_images.length}</span>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-24">
                            {project.gallery_images.map((img: string, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                    className="relative bg-[#111] aspect-[4/3] group overflow-hidden rounded-2xl md:rounded-3xl shadow-lg ring-1 ring-white/5"
                                >
                                    <Image
                                        src={img}
                                        alt={`Gallery ${idx}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        onClick={() => setZoomImage(img)}
                                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 ease-out cursor-zoom-in"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

            </article>

            <ChangelogOverlay
                isOpen={showChangelog}
                onClose={() => setShowChangelog(false)}
                githubUrl={project.github_url}
                projectTitle={project.title}
            />

            <ImageZoomOverlay
                isOpen={!!zoomImage}
                onClose={() => setZoomImage(null)}
                imageUrl={zoomImage || ""}
                altText={project.title}
            />

        </main>
    );
}
