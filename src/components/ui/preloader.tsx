"use client";

import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";

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
    const textRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        if (!textRef.current) return;

        // Reset state immediately to prevent "weird" flashes
        gsap.set(textRef.current, {
            y: 30,
            opacity: 0,
            filter: "blur(8px)",
            scale: 0.9
        });

        const tl = gsap.timeline({
            onComplete: () => {
                if (currentIndex === greetings.length - 1) {
                    onComplete();
                } else {
                    setCurrentIndex((prev: number) => prev + 1);
                }
            }
        });

        // Entrance - Softer/Elegant
        tl.to(textRef.current, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.9,
            ease: "power3.out"
        })
            // Hold - Slightly longer for readability
            .to({}, { duration: 0.6 })
            // Exit - Smooth
            .to(textRef.current, {
                y: -20,
                opacity: 0,
                filter: "blur(4px)",
                scale: 1.02,
                duration: 0.6,
                ease: "power3.in"
            });

        return () => {
            tl.kill();
        };
    }, [currentIndex, onComplete]);

    return (
        <div className="flex items-center justify-center w-full h-full cursor-none overflow-hidden bg-[#050805]">
            <p
                ref={textRef}
                style={{
                    opacity: 0,
                    fontWeight: 300,
                }}
                className="text-4xl md:text-6xl text-white absolute font-sans tracking-tight"
            >
                {greetings[currentIndex].text}
            </p>
        </div>
    );
};
