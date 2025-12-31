"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { SocialStories } from "@/components/ui/social-stories";
import TextExplode from "./text-explode";
import { X } from "lucide-react";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuVariants: Variants = {
    closed: {
        y: "100%",
        transition: {
            duration: 0.5,
            ease: [0.32, 0, 0.67, 0]
        }
    },
    open: {
        y: "0%",
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const linkVariants: Variants = {
    closed: { opacity: 0, scale: 0.95, y: 10 },
    open: (i: number) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            delay: 0.15 + i * 0.08,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
        }
    })
};

const LINKS = ["Home", "Works", "About"];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const y = useMotionValue(0);
    const [hasExploded, setHasExploded] = useState(false);
    const [triggerExplode, setTriggerExplode] = useState(false);

    // Hard-Resistance Transform: Non-linear power curve for a "hard rubber" feel
    // raw drag value -> visual stretch value
    const stretch = useTransform(y, (v: any) => {
        const num = typeof v === 'string' ? parseFloat(v) : v;
        const rawY = -(num || 0);
        if (rawY <= 0) return 0;
        // Steep curve: first 50px are easy, then it gets exponentially hard
        return Math.pow(rawY, 0.55);
    });

    // Thresholds adjusted for early reveal and a firm "earned" payoff
    const textOpacity = useTransform(stretch, [10, 50], [0, 1]);
    const textScale = useTransform(stretch, [10, 50], [0.85, 1]);
    const textY = useTransform(stretch, [0, 50], [20, 0]); // Slide up from bottom
    const barHeight = useTransform(stretch, [0, 200], [0, 180]);

    useEffect(() => {
        const unsubscribe = stretch.on("change", (v: number) => {
            // Trigger explosion at a reachable threshold (rawY ≈ 470px)
            if (v > 85 && !hasExploded && isOpen) {
                setHasExploded(true);
                setTriggerExplode(true);
            } else if (v < 30 && hasExploded) {
                setHasExploded(false);
                setTriggerExplode(false);
            }
        });
        return () => unsubscribe();
    }, [hasExploded, isOpen, stretch]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        style={{ y }}
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        drag="y"
                        dragConstraints={{ top: -2000, bottom: 0 }} // Allow deep fight against resistance
                        dragElastic={0}
                        onDragEnd={(_, info) => {
                            setHasExploded(false);
                            setTriggerExplode(false);
                            if (info.offset.y > 100 || info.velocity.y > 500) {
                                onClose();
                            } else {
                                // Snappy return to simulate rubber band Snap
                                animate(y, 0, {
                                    type: "tween",
                                    ease: [0.33, 1, 0.68, 1], // easeOutQuart
                                    duration: 0.4
                                });
                            }
                        }}
                        className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-white/10 rounded-t-[32px] p-8 z-[100] pb-12 cursor-grab active:cursor-grabbing shadow-[0_-30px_60px_rgba(0,0,0,0.6)]"
                    >
                        {/* Visually Infinite Background - Massive filler */}
                        <div className="absolute top-[60%] left-0 right-0 h-[800vh] bg-[#111111] -z-10" />

                        {/* Close Indicator */}
                        <div className="flex justify-center mb-8">
                            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                        </div>

                        {/* Links */}
                        <div className="flex flex-col gap-6 items-center">
                            {LINKS.map((item, i) => (
                                <motion.div
                                    key={item}
                                    custom={i}
                                    variants={linkVariants}
                                    initial="closed"
                                    animate="open"
                                >
                                    <Link
                                        href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                        onClick={onClose}
                                        className="text-3xl font-medium text-white/90 hover:text-white transition-colors tracking-tight"
                                    >
                                        {item}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Story Trigger */}
                        <motion.div
                            custom={LINKS.length}
                            variants={linkVariants}
                            initial="closed"
                            animate="open"
                            className="flex justify-center mt-12 mb-12"
                        >
                            <SocialStories />
                        </motion.div>

                        {/* Easter Egg Bottom Zone - Text anchored to the absolute bottom edge */}
                        <motion.div
                            style={{ height: barHeight }}
                            className="absolute bottom-0 left-0 right-0 flex items-end justify-center overflow-hidden pointer-events-none"
                        >
                            <motion.div
                                style={{ opacity: textOpacity, scale: textScale, y: textY }}
                                className="px-4 pb-4" // Anchored to the very bottom
                            >
                                <TextExplode
                                    text="You stretched it too much"
                                    mode="manual"
                                    trigger={triggerExplode}
                                    className="text-lg md:text-xl font-bold text-red-500 whitespace-nowrap"
                                    onComplete={() => setTriggerExplode(false)}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
