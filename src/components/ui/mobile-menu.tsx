"use client";

import { motion, AnimatePresence, Variants, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

// import { SocialStories } from "@/components/ui/social-stories";
// import TextExplode from "./text-explode";
import { X } from "lucide-react";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitch?: (path: string) => void;
    isMinimal?: boolean;
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



export function MobileMenu({ isOpen, onClose, onSwitch, isMinimal }: MobileMenuProps) {
    const pathname = usePathname();
    const router = useRouter();
    const y = useMotionValue(0);

    // Prefetch Home on mount for instant load after animation
    useEffect(() => {
        router.prefetch("/");
    }, [router]);

    // Hard-Resistance Transform: "Stretch very slowly" -> Heavy linear resistance
    // raw drag value -> visual stretch value
    const stretch = useTransform(y, (v: any) => {
        const num = typeof v === 'string' ? parseFloat(v) : v;
        const rawY = -(num || 0);
        if (rawY <= 0) return 0;

        // Linear heavy resistance: moves 1px for every 4px of finger drag
        return rawY * 0.25;
    });

    // Thresholds adjusted for early reveal
    const textOpacity = useTransform(stretch, [2, 15], [0, 1]);
    const textScale = useTransform(stretch, [2, 15], [0.9, 1]);
    const barHeight = useTransform(stretch, [0, 40], [0, 80]);

    // Removed explosion logic entirely

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
                        dragConstraints={{ top: -85, bottom: 0 }} // Limit expansion to just show the text
                        dragElastic={0.05} // Slight elasticity at the limit so it doesn't feel broken
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 85 || info.velocity.y > 500) {
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
                        <div className="flex justify-center mb-6">
                            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                        </div>

                        {/* Spacer or Alternative Content - Removed SocialStories as per user request */}
                        <div className="mb-8" />

                        {/* Links - Clean vertical stack */}
                        <div className="flex flex-col gap-8 items-center justify-center min-h-[200px]">
                            {["Home", "Works", "About", isMinimal ? "Main" : "Minimal"].map((item, i) => (
                                <motion.div
                                    key={item}
                                    custom={i}
                                    variants={linkVariants}
                                    initial="closed"
                                    animate="open"
                                >
                                    <Link
                                        href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                        prefetch={true}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Handle Switch Item
                                            if (item === "Minimal" || item === "Main") {
                                                if (onSwitch) {
                                                    const target = item === "Main" ? "/" : "/minimal";
                                                    onSwitch(target);
                                                }
                                                return;
                                            }

                                            onClose();
                                            const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;

                                            if (pathname === href) {
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            } else {
                                                // Smooth Transition: Close menu (0.4s) -> Then Navigate
                                                setTimeout(() => {
                                                    router.push(href);
                                                }, 400);
                                            }
                                        }}
                                        className={cn(
                                            "text-4xl font-medium transition-colors tracking-tight",
                                            (item === "Minimal" || item === "Main")
                                                ? "text-white/40 italic font-serif"
                                                : "text-white/90 hover:text-white"
                                        )}
                                    >
                                        {item}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Spacer to push content up slightly */}
                        <div className="h-16" />

                        {/* Easter Egg Bottom Zone - Static Text with Apple Emoji */}
                        <motion.div
                            style={{ height: barHeight }}
                            className="absolute bottom-0 left-0 right-0 flex items-end justify-center overflow-hidden pointer-events-none"
                        >
                            <motion.div
                                style={{
                                    opacity: textOpacity,
                                    scale: textScale,
                                }}
                                className="px-4 pb-4 flex items-center gap-2" // Anchored to the very bottom
                            >
                                <span className="text-lg md:text-xl font-bold text-white/50 whitespace-nowrap">
                                    Why are you stretching that !
                                </span>
                                {/* Apple-style Broken Heart Emoji via CDN to ensure Windows assumes it's Apple */}
                                <img
                                    src="https://emojicdn.elk.sh/🤨?style=apple"
                                    alt="sus"
                                    className="w-6 h-6 mb-0.5"
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
