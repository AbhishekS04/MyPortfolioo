"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for "cinematic" easing
            }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
}
