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

import { createPortal } from "react-dom";

export function ChangelogOverlay({ isOpen, onClose, githubUrl, projectTitle }: ChangelogOverlayProps) {
    const [commits, setCommits] = useState<GithubCommit[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [mounted, setMounted] = useState(false);
    const itemsPerPage = 3; // Fixed number of items to prevent scrolling

    // Mount state for portal
    useEffect(() => {
        setMounted(true);
    }, []);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const preventDefault = (e: TouchEvent) => {
                // Only prevent if we are touch-moving on the backdrop or non-scrollable parts
                // But since we want NO scroll at all, we'll be strict.
                e.preventDefault();
            };
            document.addEventListener('touchmove', preventDefault, { passive: false });
            return () => {
                document.body.style.overflow = '';
                document.removeEventListener('touchmove', preventDefault);
            };
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && githubUrl) {
            setLoading(true);
            fetchGithubCommits(githubUrl).then(data => {
                setCommits(data);
                setLoading(false);
                setCurrentPage(1);
            });
        }
    }, [isOpen, githubUrl]);

    if (!mounted) return null;

    // Calculate pagination with safety check
    const isCommitsArray = Array.isArray(commits);
    const totalPages = isCommitsArray ? Math.ceil(commits.length / itemsPerPage) : 0;
    const currentCommits = isCommitsArray
        ? commits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : [];

    const overlayContent = (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden touch-none overscroll-none"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
                    />

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-[101] opacity-30" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col h-auto max-h-[95vh] sm:max-h-[85vh] z-[102] touch-auto overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 sm:p-8 border-b border-white/10 flex items-center justify-between relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 opacity-50" />
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="p-3.5 rounded-2xl bg-[#111] border border-white/10">
                                    <FaGithub className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase italic truncate">{projectTitle}</h2>
                                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 hidden sm:block">System_Protocol::V_HISTORY</p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="relative z-10 p-3 rounded-full bg-white/5 text-white/40 hover:text-white transition-all group/close"
                                aria-label="Close"
                            >
                                <X className="w-6 h-6 group-hover/close:rotate-90 transition-transform duration-500" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 sm:p-8 space-y-6 overflow-hidden min-h-[400px]">
                            {loading ? (
                                <div className="h-80 flex flex-col items-center justify-center gap-6">
                                    <Loader2 className="w-12 h-12 animate-spin text-emerald-500/50" />
                                    <p className="text-[10px] uppercase font-black tracking-[0.5em] text-white/20 animate-pulse italic">Accessing_Encrypted_Logs...</p>
                                </div>
                            ) : currentCommits.length > 0 ? (
                                <div className="space-y-4 h-full">
                                    {currentCommits.map((commit, idx) => (
                                        <motion.div
                                            key={commit.sha}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-[#0c0c0c] border border-white/5 rounded-[24px] p-5 sm:p-6 group hover:bg-[#0e0e0e] hover:border-white/10 transition-all duration-300 relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start gap-4 mb-4 relative z-10">
                                                <p className="text-sm sm:text-base text-white/90 font-medium leading-normal flex-1 tracking-tight line-clamp-2">
                                                    {commit.commit.message.split('\n')[0]}
                                                </p>
                                                <a
                                                    href={commit.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-xl bg-white/5 text-white/30 hover:text-emerald-400 transition-all"
                                                >
                                                    <FaArrowUpRightFromSquare className="w-3.5 h-3.5" />
                                                </a>
                                            </div>

                                            <div className="flex items-center justify-between text-[9px] uppercase font-black tracking-[0.15em] relative z-10 text-white/30">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-emerald-400">{commit.author?.login || "System"}</span>
                                                    <span className="opacity-20">•</span>
                                                    <span>
                                                        {new Date(commit.commit.author.date).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="font-mono opacity-50">#{commit.sha.substring(0, 7)}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-60 flex flex-col items-center justify-center text-white/10 uppercase font-black tracking-widest text-xs italic">
                                    Null_Reference::Log_Empty
                                </div>
                            )}
                        </div>

                        {/* Paginated Hud Footer */}
                        <div className="px-6 sm:p-8 py-5 bg-[#080808] border-t border-white/5 flex items-center justify-between">
                            <div className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 flex items-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1 || loading}
                                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 disabled:opacity-20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6" /></svg>
                                </button>

                                <span className="text-white/40">
                                    <span className="text-emerald-500">{currentPage.toString().padStart(2, '0')}</span>
                                    <span className="mx-2 opacity-20">/</span>
                                    {totalPages.toString().padStart(2, '0')}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || loading}
                                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 disabled:opacity-20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6" /></svg>
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-[8px] uppercase font-black tracking-[0.4em] text-emerald-500/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="hidden sm:inline">LIVE_FEED_SYNC</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(overlayContent, document.body);
}
