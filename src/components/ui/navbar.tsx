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
import { useEffect } from "react";

export function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSwitching, setIsSwitching] = useState(false);
    const pathname = usePathname()
    const router = useRouter();
    const searchParams = useSearchParams();

    const fromMinimal = searchParams.get('from') === 'minimal';
    const isMinimal = pathname === "/minimal" || fromMinimal;

    // Reset switch state when pathname changes
    useEffect(() => {
        setIsSwitching(false);
    }, [pathname]);

    const handleSwitch = (target: string) => {
        setIsSwitching(true);
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

    // Special case: If we are in "Minimal Project Mode" (works page + from=minimal), we might want to hide the Standard Navbar 
    // BUT, the user asked for context retention. Let's keep the navbar but ensure it points back to minimal.
    // Actually, if we are in a project detail, usually the navbar is hidden or different?
    // Looking at the original code: `pathname?.startsWith("/works/")` was returning NULL. 
    // So the navbar was HIDDEN on works pages. 
    // IF the navbar is hidden on works pages, then our changes to the navbar "Minimal/Main" toggle won't be seen there anyway.
    // The "Show all projects" link in the project detail view will handle the return.
    // However, the USER said: "whenever I am in the minimal portfolio if I click any project... if I click on like back to works or any other button... it's like dropping me landing me into the main portfolio".
    // This implies they might be seeing SOME navigation or using the browser back button? 
    // Or maybe they WANT the navbar to be visible and correct?
    // If the navbar was hidden, they must have been using the "Back to Works" link in `project-details-view.tsx`.
    // So `project-details-view.tsx` needs the fix most.
    // BUT, if I remove `pathname?.startsWith("/works/")` from the hide list, the navbar will appear.
    // Let's stick to the user request: "Show all projects then it's go to work section... make the nap for the same height like the details are".
    // "Nap" probably means "Nav". 
    // "Make the nap for the same height like the details are" -> Ensure navbar consistency? 
    // Let's Assume the navbar IS hidden on works pages currently (based on line 40).
    // I will NOT unhide it for now, unless requested. The "Back to Works" button in `project-details-view` is the key.
    // Wait, if I'm on `/minimal`, I see the navbar. 
    // If I click a project, I go to `/works/slug`. Navbar is hidden. 
    // User clicks "Back to Works" (in project detail). It goes to `/works`.
    // `/works` is probably the MAIN portfolio works page? Or does `/works` exist?
    // Let's check `project-details-view.tsx`: Link href="/works".
    // Yes, that goes to the main works page.
    // So I need to change that link in `project-details-view.tsx`.

    // What about "make the nap for the same height like the details are"?
    // Maybe they mean the Navbar on the Minimal Page should match the positioning/height of the "Back" button on the Details page?
    // Minimal page padding: `pt-32 md:pt-40`.
    // Project Detail padding: `pt-32 md:pt-48`.
    // The Navbar itself (in `navbar.tsx`) has `h-13` (mobile) and `md:h-16`.
    // I will address the toggle button styles here first.

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
                    {(isMinimal
                        ? ["Home", "Minimal", "Main"]
                        : ["Home", "Works", "About", "Minimal", "Main"]
                    ).map(item => {
                        // Filter out the current mode from the switch options if needed, but user wants "Main" button visible in Minimal and vice-versa.
                        // Actually, if we are in Minimal, we show "Main". If in Main, we show "Minimal".
                        // The user said: "I have only two bottles like home button and minimal and main button other ones are useless" in minimal.
                        // And "minimal and the main button in the desktop screen uh to have a background like separate background and I just want it without background"

                        // Let's clean up the list logic first.
                        if (isMinimal && item !== "Home" && item !== "Main") return null;
                        if (!isMinimal && item === "Main") return null; // In Main (Standard), we show "Minimal".
                        if (isMinimal && item === "Minimal") return null; // In Minimal, we show "Main".

                        // Wait, the previous logic was: `isMinimal ? "Main" : "Minimal"`. 
                        // Let's revert to a cleaner map source.
                    })}

                    {/* Re-implementing with cleaner logic */}
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

                        return (
                            <Link
                                key={link.label}
                                href={link.href}
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
                                    isActive ? "text-white" : "text-white/60 hover:text-[#007AFF]"
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

            <TransitionOverlay isSwitching={isSwitching} targetMode={isMinimal ? "Detailed" : "Minimal"} />
        </>
    )
}
