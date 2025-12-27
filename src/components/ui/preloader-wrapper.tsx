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
    const [isVisible, setIsVisible] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Only show if we are on the home page AND it hasn't been shown yet
        if (pathname === "/" && !globalHasShownPreloader) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        }
    }, [pathname]);

    const handleComplete = () => {
        setIsVisible(false);
        globalHasShownPreloader = true;
        document.body.style.overflow = "";
    };

    // Prevent hydration mismatch by only rendering client-side logic after mount
    if (!isClient) {
        return <>{children}</>;
    }

    return (
        <PreloaderContext.Provider value={{ hasShown: globalHasShownPreloader }}>
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.div
                        key="global-preloader"
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] bg-black"
                    >
                        <Preloader onComplete={handleComplete} />
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
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
