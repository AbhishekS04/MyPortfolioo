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
        // 1.0s overlap for snappy but smooth feel
        const stepDuration = 1000;

        const timeout = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
        }, stepDuration);

        return () => clearTimeout(timeout);
    }, [currentIndex, onComplete]);

    const textVariants = {
        initial: {
            opacity: 0,
            y: 20, // Reduced movement for stability
            filter: "blur(5px)", // Lighter blur for performance
        },
        animate: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                // 0.75s enter - smooth/elegant
                duration: 0.75,
                ease: [0.33, 1, 0.68, 1] as const,
            }
        },
        exit: {
            opacity: 0,
            y: -20, // Reduced movement
            filter: "blur(5px)", // Match entrance
            transition: {
                // 0.5s exit - clears the stage effectively without rushing
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1] as const
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
