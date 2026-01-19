"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Greeting {
    text: string;
    language: string;
}

const greetings: Greeting[] = [
    { text: "Hello", language: "English" },
    { text: "Bonjour", language: "French" },
    { text: "নমস্কার", language: "Bengali" },
    { text: "नमस्ते", language: "Hindi" },
];

interface PreloaderProps {
    onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex === greetings.length - 1) {
            const timeout = setTimeout(() => {
                onComplete();
            }, 1200);
            return () => clearTimeout(timeout);
        }

        const stepDuration = currentIndex === 0 ? 1800 : 1500;

        const timeout = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
        }, stepDuration);

        return () => clearTimeout(timeout);
    }, [currentIndex, onComplete]);

    const textVariants = {
        initial: {
            opacity: 0,
            y: 30,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.33, 1, 0.68, 1] as const,
            }
        },
        exit: {
            opacity: 0,
            y: -30,
            transition: {
                duration: 0.6,
                ease: [0.33, 1, 0.68, 1] as const
            }
        },
    };

    return (
        <div className="flex items-center justify-center w-full h-full cursor-none overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.p
                    key={currentIndex}
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-4xl md:text-6xl font-medium tracking-tight text-white font-sans absolute"
                >
                    {greetings[currentIndex].text}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};
