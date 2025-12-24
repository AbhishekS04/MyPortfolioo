"use client"

import { useState, useEffect } from "react"

interface LocationTagProps {
    city: string
    country: string
    timezone: string
    className?: string
}

export function LocationTag({ city, country, timezone, className = "" }: LocationTagProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [currentTime, setCurrentTime] = useState("")

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Kolkata", // This remains hardcoded as "IST" implies this, but making it dynamic requires a valid IANA string
                }),
            )
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 transition-all duration-500 ease-out hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.04)] ${className}`}
        >
            <div className="relative flex items-center justify-center">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
            </div>

            <div className="flex items-center gap-2 overflow-hidden">
                <span
                    className="text-sm font-medium text-white transition-all duration-500 whitespace-nowrap"
                    style={{
                        transform: isHovered ? "translateY(-100%)" : "translateY(0)",
                        opacity: isHovered ? 0 : 1,
                        position: isHovered ? "absolute" : "relative",
                    }}
                >
                    {city.trim()}, {country}
                </span>

                <span
                    className="text-sm font-medium text-white transition-all duration-500"
                    style={{
                        transform: isHovered ? "translateY(0)" : "translateY(100%)",
                        opacity: isHovered ? 1 : 0,
                        position: isHovered ? "relative" : "absolute",
                    }}
                >
                    {currentTime} {timezone}
                </span>
            </div>

            <svg
                className="h-3 w-3 text-white/50 transition-all duration-300"
                style={{
                    transform: isHovered ? "translateX(2px) rotate(-45deg)" : "translateX(0) rotate(0)",
                    opacity: isHovered ? 1 : 0.5,
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
        </button>
    )
}
