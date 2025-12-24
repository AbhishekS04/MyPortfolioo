"use client"

import Link from "next/link"
import { SocialStories } from "@/components/ui/social-stories"
import { motion } from "framer-motion"
import { hendrigo } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export function NavBar() {
    return (
        <nav
            className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-white/5 h-16 px-4 md:px-6 flex items-center justify-between"
        >
            {/* Left: Signature Logo - Direct Font Class Usage */}
            <div className="flex-shrink-0">
                <Link href="/" className="group block">
                    <span className={cn(
                        hendrigo.className,
                        "text-3xl md:text-4xl text-white group-hover:text-blue-400 transition-colors duration-300 tracking-wide"
                    )}>
                        Abhishek
                    </span>
                </Link>
            </div>

            {/* Center: Nav Links - Visible on Mobile (Static flow) / Centered on Desktop (Absolute) */}
            <div className="flex items-center gap-1.5 md:gap-2 md:absolute md:left-1/2 md:-translate-x-1/2">
                {["Home", "Works", "Contact"].map((item) => (
                    <Link
                        key={item}
                        href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                        className="px-3 py-1.5 rounded-full text-[10px] md:text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider border border-transparent hover:border-white/5"
                    >
                        {item}
                    </Link>
                ))}
            </div>

            {/* Right: Social Stories */}
            <div className="flex-shrink-0 flex items-center gap-4">
                <SocialStories />
            </div>
        </nav>
    )
}
