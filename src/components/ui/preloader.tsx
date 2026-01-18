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
    // { text: "Hola", language: "Spanish" },
    // { text: "안녕하세요", language: "Korean" },
    // { text: "Ciao", language: "Italian" },
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
        // 2.5s per word - Luxurious, slow pace to ensure readability and cover loading
        const stepDuration = 2500;

        const timeout = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
        }, stepDuration);

        return () => clearTimeout(timeout);
    }, [currentIndex, onComplete]);

    const textVariants = {
        initial: {
            opacity: 0,
            y: 30, // Gentle rise
            filter: "blur(10px)", // Soft, dreamy blur
        },
        animate: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                // 1.5s enter - very slow and elegant
                duration: 1.5,
                ease: [0.25, 1, 0.5, 1] as const,
            }
        },
        exit: {
            opacity: 0,
            y: -30, // Gentle float up
            filter: "blur(10px)",
            transition: {
                // 1.0s exit - slow fade out overlapping with next entrance
                duration: 1.0,
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
            <AnimatePresence>
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
