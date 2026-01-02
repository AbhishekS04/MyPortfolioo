"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ConsciousnessMode = () => {
    const [isActive, setIsActive] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLocked, setIsLocked] = useState(true); // Default locked until checked
    const progressRef = useRef(0);
    const lastScrollY = useRef(0);
    const lastTime = useRef(0);
    const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check persistence
        const witnessed = localStorage.getItem("consciousness_witnessed");
        if (!witnessed) setIsLocked(false);
    }, []);

    useEffect(() => {
        const handleScroll = (e: Event) => {
            if (isActive) return;

            const now = Date.now();
            const currentScrollY = window.scrollY;
            const deltaY = Math.abs(currentScrollY - lastScrollY.current);
            const deltaTime = now - lastTime.current;

            // Update refs
            lastScrollY.current = currentScrollY;
            lastTime.current = now;

            // LOGIC:
            // 1. Shift Key must be held (we check via a separate listener or just window.event if possible, but React safer to track key state)
            // Actually, we can check keyboard state via a ref tracker.
        };

        // We need a key tracker
        // But simpler: We can check MouseEvent modifiers? No, scroll is an Event or WheelEvent.
        // WheelEvent has shiftKey. But 'scroll' event does not.
        // Let's listen to 'wheel' for the trigger?
        // - "scroll" event fires AFTER layout change.
        // - "wheel" event fires ON input.
        // User said "Scroll slowly". Wheel is better for detecting "Intent".

    }, [isActive]);

    // Better Logic:
    // Track Shift Key State
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    useEffect(() => {
        if (isLocked) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Shift") setIsShiftPressed(true);
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Shift") {
                setIsShiftPressed(false);
                if (!isActive) {
                    setProgress(0); // Reset if let go before completion
                    progressRef.current = 0;
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [isActive, isLocked]);

    // Track Scroll
    useEffect(() => {
        if (isLocked || !isShiftPressed || isActive) return;

        let animationFrame: number;

        const checkScroll = () => {
            // We need to detect "Active Scrolling" but "Slow".
            // Since scroll events are discrete, let's just decay the progress if NO scroll happens.
        };

        const handleWheel = (e: WheelEvent) => {
            if (isLocked || !isShiftPressed || isActive) return;

            // Speed Check
            // Typical fast scroll is > 50-100 delta.
            // Slow scroll is < 20.
            const speed = Math.abs(e.deltaY);

            if (speed > 0 && speed < 30) {
                // Good speed. Increment.
                // Target: 7 seconds.
                // Assuming ~60 wheel events per second for continuous smooth scrolling (trackpad), or ~10 for ratcheted mouse.
                // Let's aim safely for a mix. 0.4 per event is roughly 250 events.
                // If 60hz -> 4 seconds. If 30hz -> 8 seconds.
                // Let's try 0.25 to be safe for 7s on smooth trackpads.
                progressRef.current += 0.25;

                if (progressRef.current > 100) {
                    progressRef.current = 100;
                    setIsActive(true);
                    localStorage.setItem("consciousness_witnessed", "true");
                }
                setProgress(progressRef.current);
            } else if (speed > 50) {
                // Too fast! Reset punishment.
                progressRef.current = Math.max(0, progressRef.current - 5);
                setProgress(progressRef.current);
            }

            // Reset inactivity timer
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
            inactivityTimer.current = setTimeout(() => {
                // Decay if stopped
                const decay = setInterval(() => {
                    progressRef.current -= 2;
                    if (progressRef.current <= 0) {
                        progressRef.current = 0;
                        clearInterval(decay);
                    }
                    setProgress(progressRef.current);
                }, 50);
            }, 500);
        };

        window.addEventListener("wheel", handleWheel);
        return () => window.removeEventListener("wheel", handleWheel);
    }, [isShiftPressed, isActive, isLocked]);


    // Auto-dismiss after activation
    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                setIsActive(false);
                setProgress(0);
                progressRef.current = 0;
            }, 4500); // Wait for text to fully play out
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    return (
        <AnimatePresence>
            {/* PROGRESS FEEDBACK (Subtle) */}
            {progress > 5 && !isActive && (
                <motion.div
                    className="fixed bottom-0 left-0 h-1 bg-white/20 z-[9999]"
                    style={{ width: `${progress}%` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
            )}

            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center"
                >
                    {/* BLUR OVERLAY */}
                    <motion.div
                        initial={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
                        animate={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.4)" }}
                        exit={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0"
                    />

                    {/* TEXT */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="relative z-10 text-center px-4"
                    >
                        <h2 className="text-3xl md:text-5xl font-light tracking-widest text-[#e2e2e2] font-serif italic mb-4">
                            You’re paying attention.
                        </h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="text-sm uppercase tracking-[0.3em] text-white/50"
                        >
                            I like that.
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
