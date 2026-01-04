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
    // Default to TRUE if not in admin, not shown yet, and on a VALID route.
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window !== 'undefined' && globalHasShownPreloader) return false;

        const validRoutes = ["/", "/about", "/works", "/contact"];
        const isDynamicWork = pathname?.startsWith("/works/");
        const isAdmin = pathname?.startsWith("/admin");

        const isValidRoute = validRoutes.includes(pathname || "") || isDynamicWork || isAdmin;

        // Skip preloader for admin or invalid (404) routes
        if (isAdmin || !isValidRoute) return false;

        return true;
    });

    useEffect(() => {
        // Remove static splash screen if it exists
        const staticSplash = document.getElementById('static-splash');
        if (staticSplash) {
            staticSplash.style.opacity = '0';
            setTimeout(() => {
                staticSplash.remove();
            }, 300);
        }
    }, []);

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
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.div
                        key="global-preloader"
                        initial={{ y: 0 }}
                        exit={{
                            y: "-100%",
                            transition: {
                                duration: 1.2, // Slower for more elegance
                                ease: [0.83, 0, 0.17, 1] // "Quint" like easing, very dramatic slow start/end
                            }
                        }}
                        className="fixed inset-0 z-[9999] bg-[#050805] flex items-center justify-center"
                    >
                        <Preloader onComplete={handleComplete} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 
               Render children immediately. 
               We REMOVED the opacity toggle so the browser paints the LCP element 
               instantly behind the preloader layer. This fixes the LCP score.
            */}
            <div className="relative">
                {children}
            </div>
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
