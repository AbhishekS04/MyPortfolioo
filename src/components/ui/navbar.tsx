"use client"

import Link from "next/link"
import { SocialStories } from "@/components/ui/social-stories"
import { bolivia } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { MobileMenu } from "./mobile-menu"
import { motion } from "framer-motion"
import { TransitionOverlay } from "./transition-overlay";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function NavBarInner() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSwitching, setIsSwitching] = useState(false);
    const [transitionTarget, setTransitionTarget] = useState<"Minimal" | "Detailed" | null>(null);
    const pathname = usePathname()
    const router = useRouter();
    const searchParams = useSearchParams();

    const fromMinimal = searchParams.get('from') === 'minimal';
    const isMinimal = pathname === "/minimal" || fromMinimal;

    // Reset switch state when pathname changes
    useEffect(() => {
        if (isSwitching) {
            // Delay turning off the switch state slightly to allow page load to start under the overlay
            // But usually we want to turn it off after the new page mounts.
            // However, the `TransitionOverlay` handles `exit` animation. 
            // If we turn off `isSwitching` immediately, it might exit too early or glitch.
            // But the text glitch happens because `isMinimal` changes immediately upon route change.
            // We need `TransitionOverlay` to use `transitionTarget` instead of `isMinimal`.
            const t = setTimeout(() => {
                setIsSwitching(false);
                setTransitionTarget(null);
            }, 500); // Wait for exit animation or ensure smooth end
            return () => clearTimeout(t);
        }
    }, [pathname]);

    const handleSwitch = (target: string) => {
        setIsSwitching(true);
        // Determine target mode based on where we are going
        // If target is "/", we are going to Detailed (Main)
        // If target is "/minimal", we are going to Minimal
        setTransitionTarget(target === "/minimal" ? "Minimal" : "Detailed");

        // Wait for entrance animation
        setTimeout(() => {
            router.push(target);
        }, 800);
    };

    // Hide Navbar on specific route
    if (
        pathname?.includes("/pickup/recycle04") ||
        pathname?.startsWith("/gaming") ||
        pathname?.includes("/github/abhisheks04") ||
        // pathname?.startsWith("/works/") || // Show navbar on works, letting dynamic state handle it
        pathname?.startsWith("/admin")
    ) return null;

    const handleLogoClick = (e: React.MouseEvent) => {
        if (pathname === "/") {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    return (
        <>
            <nav
                className="
                    fixed z-50 transition-all duration-300
                    top-4 left-8 right-8 h-13 rounded-full
                    bg-[#0a0a0a]/60 backdrop-blur-xl
                    border border-white/5 shadow-sm

                    pl-4 pr-2
                    flex items-center justify-between

                    md:top-0 md:left-0 md:right-0 md:w-full md:h-16 md:rounded-none
                    md:bg-[#0a0a0a]/70 md:border-b md:border-white/5 md:shadow-none
                    md:px-8
                "
            >
                {/* Left: Logo */}
                <Link
                    href={isMinimal ? "/minimal" : "/"}
                    onClick={(e) => {
                        if (isMinimal && pathname === "/minimal") {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        } else if (!isMinimal && pathname === "/") {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                    }}
                    className="flex items-center group"
                >
                    <span
                        className={cn(
                            bolivia.className,
                            "text-3xl md:text-4xl text-white/90 group-hover:text-[#007AFF] transition-colors duration-300 tracking-wide pt-1"
                        )}
                    >
                        Abhishek
                    </span>
                </Link>

                {/* Center (Desktop only) */}
                <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    {[
                        { label: "Home", href: isMinimal ? "/minimal" : "/" },
                        { label: "Works", href: "/works", hidden: isMinimal },
                        { label: "About", href: "/about", hidden: isMinimal },
                        {
                            label: isMinimal ? "Main" : "Minimal",
                            href: isMinimal ? "/" : "/minimal", // Main goes to root, Minimal goes to /minimal
                            isSwitch: true
                        }
                    ].filter(link => !link.hidden).map(link => {
                        const isActive =
                            link.label === "Home" ? pathname === "/" :
                                link.label === "Works" ? pathname?.startsWith("/works") :
                                    link.label === "About" ? pathname === "/about" :
                                        false;

                        const isSwitch = link.isSwitch;

                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                prefetch={true}
                                onClick={(e) => {
                                    if (link.isSwitch) {
                                        e.preventDefault();
                                        handleSwitch(link.href);
                                    } else if (link.label === "Home") {
                                        // If in Minimal mode, Home should take us to /minimal (or scroll top)
                                        // If in Main mode, Home should take us to / (or scroll top)
                                        if (isMinimal && pathname === "/minimal") {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        } else if (!isMinimal && pathname === "/") {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }
                                    }
                                }}
                                className={cn(
                                    "text-sm font-medium transition-colors duration-300 uppercase tracking-wider relative",
                                    isActive ? "text-white" : isSwitch ? "text-white/60 hover:text-[#007AFF]" : "text-white/60 hover:text-white"
                                )}
                            >
                                {link.label}
                                {isActive && (
                                    <span className="absolute -bottom-1 left-0 w-full h-px bg-white/40" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Actions */}
                <div className="flex items-center">
                    {/* MOBILE ACTION PILL */}
                    <div
                        className="
                            md:hidden
                            flex items-center
                            gap-1.5
                            p-1
                        "
                    >
                        {/* Hamburger */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Open Menu"
                            className="
                                w-8 h-8
                                flex items-center justify-center
                                transition-colors
                                text-white/90
                                hover:text-white
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="4" x2="20" y1="7" y2="7" />
                                <line x1="4" x2="20" y1="12" y2="12" />
                                <line x1="4" x2="20" y1="17" y2="17" />
                            </svg>
                        </button>

                        {/* Social Stories */}
                        <div
                            className="
                                w-10 h-10
                                rounded-full
                                overflow-hidden
                                flex items-center justify-center
                            "
                        >
                            <SocialStories id="mobile" />
                        </div>
                    </div>

                    {/* DESKTOP */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
                            <SocialStories id="desktop" />
                        </div>
                    </div>
                </div>
            </nav>

            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onSwitch={(path) => {
                    setIsMenuOpen(false);
                    handleSwitch(path);
                }}
                isMinimal={isMinimal}
            />

            <TransitionOverlay
                isSwitching={isSwitching}
                targetMode={transitionTarget || (isMinimal ? "Detailed" : "Minimal")}
            />
        </>
    )
}

export function NavBar() {
    return (
        <Suspense fallback={<div className="h-16" />}>
            <NavBarInner />
        </Suspense>
    )
}
