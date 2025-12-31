"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { SocialStories } from "@/components/ui/social-stories";
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
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100 || info.velocity.y > 500) {
                                onClose();
                            }
                        }}
                        className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-white/10 rounded-t-[32px] p-8 z-[100] pb-12"
                    >
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

                        {/* Story Trigger unified in stagger */}
                        <motion.div
                            custom={LINKS.length}
                            variants={linkVariants}
                            initial="closed"
                            animate="open"
                            className="flex justify-center mt-12"
                        >
                            <SocialStories />
                        </motion.div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
