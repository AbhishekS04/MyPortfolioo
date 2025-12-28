"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Preloader } from "./preloader";

// Module-level variable to persist across route changes within the same session
let globalHasShownPreloader = false;

interface PreloaderContextType {
    hasShown: boolean;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export function PreloaderWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Initialize state based on session to prevent flash.
    // Default to TRUE if not in admin and not shown yet.
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window !== 'undefined' && globalHasShownPreloader) return false;
        if (pathname?.startsWith("/admin")) return false;
        return true;
    });

    useEffect(() => {
        // Handle overflow lock
        if (isVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isVisible]);

    const handleComplete = () => {
        setIsVisible(false);
        globalHasShownPreloader = true;
        document.body.style.overflow = "";
    };

    return (
        <PreloaderContext.Provider value={{ hasShown: !isVisible }}>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        key="global-preloader"
                        initial={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                        className="fixed inset-0 z-[9999] bg-[#050805]"
                    >
                        <Preloader onComplete={handleComplete} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 
               Children mount immediately when isVisible becomes false.
               Since we removed mode="wait", they mount WHILE the curtain slides up.
               This creates the perfect "reveal" effect.
            */}
            {!isVisible && <>{children}</>}
        </PreloaderContext.Provider>
    );
}

export const usePreloader = () => {
    const context = useContext(PreloaderContext);
    if (context === undefined) {
        throw new Error("usePreloader must be used within a PreloaderWrapper");
    }
    return context;
};
