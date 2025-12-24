"use client"

import Link from "next/link"
import { SocialStories } from "@/components/ui/social-stories"
import { motion } from "framer-motion"

export function NavBar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-white/5 h-16 px-4 md:px-6 flex items-center justify-between"
        >
            {/* Left: Signature Logo */}
            <div className="flex-shrink-0 scale-75 origin-left md:scale-90">
                <Link href="/" className="group block">
                    <svg
                        width="120"
                        height="40"
                        viewBox="0 0 120 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white group-hover:text-blue-400 transition-colors duration-300"
                    >
                        {/* Abstract Signature Path */}
                        <path
                            d="M10 25 C 10 25, 15 10, 25 15 C 35 20, 25 35, 15 30 C 5 25, 30 15, 40 20 S 60 30, 70 20 C 80 10, 90 30, 100 20 C 110 10, 115 15, 120 25"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="path-animate"
                        />
                    </svg>
                </Link>
            </div>

            {/* Center: Nav Links - Visible on Mobile now */}
            <div className="flex items-center gap-1 md:gap-2 absolute left-1/2 -translate-x-1/2">
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
        </motion.nav>
    )
}
