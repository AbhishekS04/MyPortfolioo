"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

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
            }, 1500);
            return () => clearTimeout(timeout);
        }

        // For intermediate words, cycle faster
        const timeout = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 800); // 800ms to ensure animations (0.3+0.4=0.7s) complete without skipping

        return () => clearTimeout(timeout);
    }, [currentIndex, onComplete]);

    // Initial enter for the first word (index 0)
    // We want a stagger or just clean enter? Use AnimatePresence mode="wait"

    const textVariants = {
        initial: {
            opacity: 0,
            y: 20,
            filter: "blur(6px)"
        },
        animate: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.4,
                ease: [0.25, 1, 0.5, 1] as const,
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            filter: "blur(6px)",
            transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] as const }
        },
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black cursor-none">
            <div className="relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {greetings[currentIndex] && (
                        <motion.div
                            key={currentIndex}
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
