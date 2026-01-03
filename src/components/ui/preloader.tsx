"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Greeting {
    text: string;
    language: string;
}

const greetings: Greeting[] = [
    { text: "Hello", language: "English" },
    { text: "Hola", language: "Spanish" },
    { text: "안녕하세요", language: "Korean" },
    { text: "Ciao", language: "Italian" },
    { text: "নমস্কার", language: "Bengali" },
    { text: "नमस्ते", "language": "Hindi" },
];

interface PreloaderProps {
    onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Handle the loop
        if (currentIndex === greetings.length - 1) {
            // Last one: Wait a bit longer, then trigger complete. 
            // We do NOT increment here, so the text remains visible until the parent unmounts the whole component.
            const timeout = setTimeout(() => {
                onComplete();
            }, 800);
            return () => clearTimeout(timeout);
        }

        // For first word "Hello", give it more time to clear initial hydration/rendering lag
        const isMobile = window.innerWidth < 768;
        const baseDuration = isMobile ? 400 : 800; // Faster loop on mobile
        const initialDuration = isMobile ? 1000 : 1400; // Faster initial hold on mobile

        const duration = currentIndex === 0 ? initialDuration : baseDuration;

        const timeout = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
        }, duration);

        return () => clearTimeout(timeout);
    }, [currentIndex, onComplete]);

    // Initial enter for the first word (index 0)
    // We want a stagger or just clean enter? Use AnimatePresence mode="wait"

    const textVariants = {
        initial: {
            opacity: 0,
            y: 20,
            filter: "blur(5px)"
        },
        animate: (index: number) => ({
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: index === 0 ? 0.6 : 0.4,
                ease: [0.25, 1, 0.5, 1] as const,
            }
        }),
        exit: {
            opacity: 0,
            y: -20,
            filter: "blur(6px)",
            transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] as const }
        },
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050805] cursor-none">
            <div className="relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {greetings[currentIndex] && (
                        <motion.div
                            key={currentIndex}
                            custom={currentIndex}
                            variants={textVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex items-center gap-4 text-white"
                        >
                            {/* Dot Indicator REMOVED */}


                            {/* Text */}
                            <span className="text-4xl md:text-6xl font-medium tracking-tight font-sans">
                                {greetings[currentIndex].text}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
