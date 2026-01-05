"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { FaGithub, FaCalendarDays, FaCodeCommit, FaUser, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { SiGithubactions } from "react-icons/si";
import { useEffect, useState } from "react";
import { fetchGithubCommits, GithubCommit } from "@/utils/github";

interface ChangelogOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    githubUrl?: string;
    projectTitle: string;
}

export function ChangelogOverlay({ isOpen, onClose, githubUrl, projectTitle }: ChangelogOverlayProps) {
    const [commits, setCommits] = useState<GithubCommit[]>([]);
    const [loading, setLoading] = useState(false);

    // Body scroll lock with padding fix
    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && githubUrl) {
            setLoading(true);
            fetchGithubCommits(githubUrl).then(data => {
                setCommits(data);
                setLoading(false);
            });
        }
    }, [isOpen, githubUrl]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/95 backdrop-blur-2xl touch-none overscroll-none"
                    />

                    {/* Scanline Effect Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-[101] opacity-20" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] z-[102]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Holographic Header */}
                        <div className="p-8 border-b border-white/10 flex items-center justify-between relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 opacity-50" />

                            <div className="flex items-center gap-5 relative z-10">
                                <div className="relative">
                                    <div className="p-4 rounded-2xl bg-[#111] border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                                        <FaGithub className="w-6 h-6 text-white/80 group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic truncate">{projectTitle}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <SiGithubactions className="w-3 h-3 text-emerald-500" />
                                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30">System_Protocol::V_HISTORY</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="relative z-10 p-3 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all group/close flex-shrink-0 ml-4"
                            >
                                <X className="w-6 h-6 group-hover/close:rotate-90 transition-transform duration-500" />
                                <div className="absolute inset-0 rounded-full border border-white/0 group-hover/close:border-white/10 scale-125 opacity-0 group-hover/close:scale-100 group-hover/close:opacity-100 transition-all duration-500" />
                            </button>
                        </div>

                        {/* Content Area with Custom Scrollbar */}
                        <div
                            className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-emerald-500/20 custom-scrollbar overscroll-contain touch-pan-y"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                        >
                            {loading ? (
                                <div className="h-80 flex flex-col items-center justify-center gap-6 relative">
                                    <div className="relative">
                                        <Loader2 className="w-12 h-12 animate-spin text-emerald-500/50" />
                                        <div className="absolute inset-0 w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-[spin_3s_linear_infinite] blur-sm opacity-50" />
                                    </div>
                                    <p className="text-[10px] uppercase font-black tracking-[0.5em] text-white/20 animate-pulse italic">Accessing_Encrypted_Logs...</p>
                                </div>
                            ) : commits.length > 0 ? (
                                <div className="space-y-4">
                                    {commits.map((commit, idx) => (
                                        <motion.div
                                            key={commit.sha}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
                                            className="group relative pl-10 pb-10 last:pb-0"
                                        >
                                            {/* Timeline Visuals */}
                                            {idx !== commits.length - 1 && (
                                                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gradient-to-b from-emerald-500/20 via-white/5 to-transparent transition-colors group-hover:from-emerald-500/40" />
                                            )}

                                            <div className="absolute left-0 top-1 w-8 h-8 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300 z-10">
                                                <FaCodeCommit className="w-3.5 h-3.5 text-white/20 group-hover:text-emerald-400 group-hover:rotate-12 transition-all" />
                                            </div>

                                            <div className="bg-[#0c0c0c] border border-white/5 rounded-[24px] p-6 group-hover:bg-[#0e0e0e] group-hover:border-white/10 transition-all duration-500 relative overflow-hidden">
                                                {/* Backdrop Glow */}
                                                <div className="absolute -right-20 -top-20 w-40 h-40 bg-emerald-500/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                                <div className="flex justify-between items-start gap-6 mb-5 relative z-10">
                                                    <p className="text-base text-white/90 font-medium leading-relaxed flex-1 tracking-tight">
                                                        {commit.commit.message.split('\n')[0]}
                                                    </p>
                                                    <a
                                                        href={commit.html_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all hover:scale-110 flex-shrink-0"
                                                        title="Launch Source Control"
                                                    >
                                                        <FaArrowUpRightFromSquare className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-6 text-[9px] uppercase font-black tracking-[0.2em] relative z-10">
                                                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 group-hover:text-white/60 transition-colors">
                                                        {commit.author?.avatar_url ? (
                                                            <img src={commit.author.avatar_url} className="w-5 h-5 rounded-full border border-white/10" alt="" />
                                                        ) : (
                                                            <FaUser className="w-3.5 h-3.5" />
                                                        )}
                                                        <span className="text-emerald-400/90">{commit.author?.login || commit.commit.author.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/20 group-hover:text-white/40 transition-colors">
                                                        <FaCalendarDays className="w-3.5 h-3.5" />
                                                        {new Date(commit.commit.author.date).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="ml-auto font-mono text-white/10 group-hover:text-emerald-500/30 transition-colors">
                                                        #{commit.sha.substring(0, 7)}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-60 flex flex-col items-center justify-center text-white/10 gap-4 italic uppercase font-black tracking-widest text-xs">
                                    <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mb-2">?</div>
                                    <p>Null_Reference::Log_Empty</p>
                                </div>
                            )}
                        </div>

                        {/* Tech Footer HUD */}
                        <div className="px-8 py-5 bg-[#080808] border-t border-white/5 flex items-center justify-between text-[8px] uppercase font-black tracking-[0.4em] text-white/20">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Synchronized_Stream
                            </span>
                            <span className="text-white/10 hidden sm:inline">Encryption_Standard_AES_256</span>
                            <span className="flex items-center gap-1 opacity-50">
                                Page_01 [V1.0.4]
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
