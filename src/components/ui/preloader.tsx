"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check session storage immediately on mount
        const hasSeen = sessionStorage.getItem("hasSeenGreeting");
        if (hasSeen) {
            setIsLoading(false);
            onComplete();
            return;
        }

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                if (prev === greetings.length - 1) {
                    clearInterval(interval);
                    setTimeout(() => {
                        sessionStorage.setItem("hasSeenGreeting", "true");
                        setIsLoading(false);
                        onComplete();
                    }, 200);
                    return prev;
                }
                return prev + 1;
            });
        }, 200); // Faster duration per word for snappier feel? Or keep 900? User said "whenever I reload". 900 is slow.
        // Reverting to similar logic but ensuring we handle the end correctly.
        // User's issue was "Stuck".

        return () => clearInterval(interval);
    }, [onComplete]);

    // Independent timer logic to ensure we don't get stuck
    useEffect(() => {
        if (currentIndex < greetings.length) {
            const timeout = setTimeout(() => {
                setCurrentIndex((prev) => {
                    const next = prev + 1;
                    if (next >= greetings.length) {
                        // End
                        setTimeout(() => {
                            sessionStorage.setItem("hasSeenGreeting", "true");
                            setIsLoading(false);
                            onComplete();
                        }, 200);
                        return prev; // Stay on last index
                    }
                    return next;
                });
            }, 250); // Speeding it up a bit to be 250ms per word -> 1.5s total. 900ms was very long (5.4s total).
            // User likely felt it was stuck because it was taking 5 seconds.
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, onComplete]);


    if (!isLoading) return null;

    const textVariants: Variants = {
        initial: { opacity: 0, y: 20, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.25, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, filter: "blur(6px)", transition: { duration: 0.25, ease: "easeIn" } },
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black cursor-none">
            <div className="relative flex items-center justify-center h-20 overflow-hidden">
                <AnimatePresence mode="wait">
                    {isLoading && greetings[currentIndex] && (
                        <motion.div
                            key={currentIndex}
                            variants={textVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex items-center justify-center"
                        >
                            <span className="text-4xl md:text-6xl font-medium tracking-tight font-sans text-white">
                                {greetings[currentIndex].text}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
