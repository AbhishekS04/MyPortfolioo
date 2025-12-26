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
        // 900ms per greeting transition logic
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;

                if (nextIndex >= greetings.length) {
                    clearInterval(interval);
                    // Wait a beat on the final greeting before triggering completion
                    setTimeout(onComplete, 1000);
                    return prevIndex;
                }

                return nextIndex;
            });
        }, 900); // 900ms duration per word

        return () => clearInterval(interval);
    }, [onComplete]);

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
            transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] as const } // Custom cubic bezier for "Apple" feel
        },
        exit: {
            opacity: 0,
            y: -20,
            filter: "blur(6px)",
            transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] as const }
        },
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black cursor-none">
            <div className="relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        variants={textVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex items-center gap-4 text-white"
                    >
                        {/* Dot Indicator */}
                        <motion.div
                            className="h-2.5 w-2.5 rounded-full bg-white"
                            layoutId="dot" // Keeps dot stable if we wanted, but here it moves with text container
                        />

                        {/* Text */}
                        <span className="text-4xl md:text-6xl font-medium tracking-tight font-sans">
                            {greetings[currentIndex].text}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
