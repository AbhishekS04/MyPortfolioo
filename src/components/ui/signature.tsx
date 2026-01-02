"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { sacramento } from "@/lib/fonts";

export function Signature() {
    const [clickCount, setClickCount] = useState(0);
    const [isTriggered, setIsTriggered] = useState(false);
    const lastClickTime = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // USER: Provide your Cloudinary or video URL here. 
    const VIDEO_SRC = "https://res.cloudinary.com/dap0u41dz/video/upload/v1767179570/james_doakes_dexter_meme_720P_HD_bgahqk.mp4";

    const handleClick = () => {
        const now = Date.now();
        const diff = now - lastClickTime.current;

        if (diff < 500) { // Rapid click window
            setClickCount(prev => {
                const newCount = prev + 1;
                if (newCount >= 3) {
                    setIsTriggered(true);
                    return 0;
                }
                return newCount;
            });
        } else {
            setClickCount(1);
        }

        lastClickTime.current = now;

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setClickCount(0);
        }, 1000);
    };

    useEffect(() => {
        if (isTriggered) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isTriggered]);

    // Buttery smooth GSAP-level extreme easing
    const wipeTransition = {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1] as const
    };

    return (
        <>
            <div
                onClick={handleClick}
                className="absolute right-4 bottom-4 md:right-10 md:bottom-10 opacity-30 select-none transition-opacity z-50 mix-blend-overlay cursor-default"
                style={{ WebkitTapHighlightColor: 'transparent' }}
            >
                {/* Signature */}
                <span className={cn(sacramento.className, "text-4xl md:text-5xl text-white/80")}>
                    Abhishek Singh
                </span>
            </div>

            <AnimatePresence mode="wait">
                {isTriggered && (
                    <div className="fixed inset-0 z-[100000] flex items-center justify-center pointer-events-auto">
                        {/* Global Fade Backdrop for richness */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { delay: 1.2, duration: 1.5 } }}
                            transition={{ duration: 1 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md"
                        />

                        {/* 4 Corners Wipe Panels */}
                        <motion.div
                            initial={{ x: "-100%", y: "-100%" }}
                            animate={{ x: "0%", y: "0%" }}
                            exit={{ x: "-100%", y: "-100%", transition: { delay: 0.8, duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
                            transition={wipeTransition}
                            className="fixed top-0 left-0 w-1/2 h-1/2 bg-black origin-top-left z-20"
                        />
                        <motion.div
                            initial={{ x: "100%", y: "-100%" }}
                            animate={{ x: "0%", y: "0%" }}
                            exit={{ x: "100%", y: "-100%", transition: { delay: 0.8, duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
                            transition={wipeTransition}
                            className="fixed top-0 right-0 w-1/2 h-1/2 bg-black origin-top-right z-20"
                        />
                        <motion.div
                            initial={{ x: "-100%", y: "100%" }}
                            animate={{ x: "0%", y: "0%" }}
                            exit={{ x: "-100%", y: "100%", transition: { delay: 0.8, duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
                            transition={wipeTransition}
                            className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-black origin-bottom-left z-20"
                        />
                        <motion.div
                            initial={{ x: "100%", y: "100%" }}
                            animate={{ x: "0%", y: "0%" }}
                            exit={{ x: "100%", y: "100%", transition: { delay: 0.8, duration: 1.4, ease: [0.76, 0, 0.24, 1] } }}
                            transition={wipeTransition}
                            className="fixed bottom-0 right-0 w-1/2 h-1/2 bg-black origin-bottom-right z-20"
                        />

                        {/* Dynamic Video Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{
                                opacity: 0,
                                scale: 1.1,
                                filter: "blur(20px)",
                                transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
                            }}
                            transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
                            className="relative z-30 flex items-center justify-center max-w-[90vw] max-h-[85vh] p-2 sm:p-4"
                        >
                            <div className="relative rounded-[32px] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] bg-black/20 ring-1 ring-white/10 group">
                                {VIDEO_SRC ? (
                                    <video
                                        autoPlay
                                        playsInline
                                        className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-[24px]"
                                        onEnded={() => setIsTriggered(false)}
                                        src={VIDEO_SRC}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <div className="w-[300px] h-[300px] flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full border-2 border-white/5 border-t-white/40 animate-spin" />
                                        <p className="text-white/20 text-xs font-mono uppercase tracking-widest">Awaiting Secret...</p>
                                    </div>
                                )}

                                {/* Dynamic Terminate Action */}
                                <button
                                    onClick={() => setIsTriggered(false)}
                                    className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-0 group-hover:opacity-100 transition-all duration-700 text-white/40 hover:text-red-500 text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] border border-white/10 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full backdrop-blur-2xl bg-black/40 hover:bg-black/90 shadow-2xl translate-y-1 group-hover:translate-y-0 font-mono z-50"
                                >
                                    [ ABORT_SEQUENCE ]
                                </button>
                            </div>
                        </motion.div>

                        {/* Restricted Zone Status HUD - Top Positioned */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, transition: { delay: 0.1 } }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-1 sm:space-y-2 w-full px-4 text-center"
                        >
                            <span className="text-red-500/60 text-[8px] sm:text-[10px] font-mono tracking-[0.3em] sm:tracking-[0.8em] uppercase whitespace-nowrap animate-pulse">
                                Restricted Zone Accessed
                            </span>
                            <span className="text-white/30 text-[7px] sm:text-[9px] font-mono tracking-[0.2em] sm:tracking-[0.4em] uppercase whitespace-nowrap">
                                Easter Egg Unlocked • Enjoy the Secret
                            </span>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
