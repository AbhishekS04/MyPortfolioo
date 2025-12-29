"use client"

import Link from "next/link"
import { SocialStories } from "@/components/ui/social-stories"
import { motion } from "framer-motion"
import { hendrigo } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { MobileMenu } from "./mobile-menu"
import { usePathname, useRouter } from "next/navigation"

export function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogoClick = (e: React.MouseEvent) => {
        if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } else {
            // For other pages, we let the Link handle it normally or do a manual push
            router.push("/");
        }
    };

    return (
        <>
            <nav
                className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-white/5 h-16 px-4 md:px-6 flex items-center justify-between"
            >
                {/* Left: Signature Logo - Direct Font Class Usage */}
                <div className="flex-shrink-0">
                    <Link
                        href="/"
                        onClick={handleLogoClick}
                        className="group block"
                    >
                        <span className={cn(
                            hendrigo.className,
                            "text-3xl md:text-4xl text-white group-hover:text-blue-400 transition-colors duration-300 tracking-wide"
                        )}>
                            Abhishek
                        </span>
                    </Link>
                </div>

                {/* Center: Nav Links - HIDDEN on Mobile, Visible on Desktop */}
                <div className="hidden md:flex items-center gap-1.5 md:gap-2 md:absolute md:left-1/2 md:-translate-x-1/2">
                    {["Home", "Works", "About"].map((item) => (
                        <Link
                            key={item}
                            href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                            className="px-3 py-1.5 rounded-full text-[10px] md:text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider border border-transparent hover:border-white/5"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="flex-shrink-0 flex items-center gap-4">
                    {/* Desktop: Show Story Directly */}
                    <div className="hidden md:block">
                        <SocialStories />
                    </div>

                    {/* Mobile: Menu Trigger */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Open Mobile Menu"
                        className="md:hidden w-10 h-10 flex items-center justify-center text-white/80 border border-white/10 rounded-full hover:bg-white/5 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" x2="20" y1="12" y2="12" />
                            <line x1="4" x2="20" y1="6" y2="6" />
                            <line x1="4" x2="20" y1="18" y2="18" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    )
}
