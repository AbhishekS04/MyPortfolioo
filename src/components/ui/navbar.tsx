"use client"

import Link from "next/link"
import { SocialStories } from "@/components/ui/social-stories"
import { bolivia } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { MobileMenu } from "./mobile-menu"
import { usePathname } from "next/navigation"

export function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    // Hide Navbar on specific route
    if (pathname?.includes("/pickup/recycle04")) return null;

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
                    href="/"
                    onClick={handleLogoClick}
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
                <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                    {["Home", "Works", "About"].map(item => (
                        <Link
                            key={item}
                            href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                            className="px-4 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider"
                        >
                            {item}
                        </Link>
                    ))}
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
                            <SocialStories />
                        </div>
                    </div>

                    {/* DESKTOP */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
                            <SocialStories />
                        </div>
                    </div>
                </div>
            </nav>

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    )
}
