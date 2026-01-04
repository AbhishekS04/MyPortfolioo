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
    const [dimension, setDimension] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimension({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    useEffect(() => {
        if (currentIndex === greetings.length - 1) {
            // Smoothest exit: hold the last word slightly longer then complete
            const timeout = setTimeout(() => {
                onComplete();
            }, 1000); // 1s hold for the last word
            return () => clearTimeout(timeout);
        }

        const isMobile = window.innerWidth < 768;
        // 1.4s per word as requested
        const stepDuration = 1400;

        const timeout = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
        }, stepDuration);

        return () => clearTimeout(timeout);
    }, [currentIndex, onComplete]);

    const textVariants = {
        initial: {
            opacity: 0,
            y: 40, // Increased movement for more "drama"
            filter: "blur(12px)", // Stronger blur
        },
        animate: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                // Reduced duration to fit within 1.4s interval (Wait Mode: Exit + Enter + Static = Interval)
                // 0.4s Exit + 0.6s Enter = 1.0s. Leaves 0.4s for static readability.
                duration: 0.6,
                ease: [0.25, 1, 0.5, 1] as const,
            }
        },
        exit: {
            opacity: 0,
            y: -40, // Match entrance movement
            filter: "blur(12px)",
            transition: {
                duration: 0.4,
                ease: [0.25, 1, 0.5, 1] as const
            }
        },
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050805] cursor-none overflow-hidden">
            {/* 
                Use absolute positioning for the text container to prevent any flex-based layout shifts 
                during size changes (though text is mostly centered, this is safer).
             */}
            <AnimatePresence mode="wait">
                {greetings[currentIndex] && (
                    <motion.p
                        key={currentIndex}
                        variants={textVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute text-4xl md:text-7xl font-light tracking-tight text-white font-sans mix-blend-difference"
                        style={{ willChange: "transform, opacity, filter" }}
                    >
                        {greetings[currentIndex].text}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};
