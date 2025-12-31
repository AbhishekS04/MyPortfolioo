"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface RatingInteractionProps {
    className?: string
}

const ratingData = [
    { emoji: "😔", label: "Terrible", color: "from-red-400 to-red-500", shadowColor: "shadow-red-500/30" },
    { emoji: "😕", label: "Poor", color: "from-orange-400 to-orange-500", shadowColor: "shadow-orange-500/30" },
    { emoji: "😐", label: "Okay", color: "from-yellow-400 to-yellow-500", shadowColor: "shadow-yellow-500/30" },
    { emoji: "🙂", label: "Good", color: "from-lime-400 to-lime-500", shadowColor: "shadow-lime-500/30" },
    { emoji: "😍", label: "Amazing", color: "from-emerald-400 to-emerald-500", shadowColor: "shadow-emerald-500/30" },
]

export function RatingInteraction({ className }: RatingInteractionProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [submitted, setSubmitted] = useState(false)

    const handleClick = async (value: number) => {
        setRating(value)
        setSubmitted(true)

        try {
            await fetch('/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: value })
            })
        } catch (e) {
            console.error("Failed to submit rating", e)
        }
    }

    const displayRating = hoverRating || rating

    if (submitted) {
        return (
            <div className={cn("flex flex-col items-center gap-4 py-8 animate-in fade-in zoom-in duration-500", className)}>
                <div className="w-16 h-16 mb-2"><img src="https://emojicdn.elk.sh/🎉?style=apple" className="w-full h-full object-contain" alt="Success" /></div>
                <p className="text-white/60 font-medium">Thank you for your feedback!</p>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col items-center gap-6", className)}>
            <div className="text-center space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">How was your experience?</p>
            </div>

            {/* Emoji rating buttons */}
            <div className="flex items-center gap-3">
                {ratingData.map((item, i) => {
                    const value = i + 1
                    const isActive = value <= displayRating

                    return (
                        <button
                            key={value}
                            onClick={() => handleClick(value)}
                            onMouseEnter={() => setHoverRating(value)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="group relative focus:outline-none"
                            aria-label={`Rate ${value}: ${item.label}`}
                        >
                            <div
                                className={cn(
                                    "relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl transition-all duration-300 ease-out bg-white/5 border border-white/5",
                                    isActive ? "scale-110 bg-white/10" : "scale-100 group-hover:scale-105 group-hover:bg-white/10",
                                )}
                            >
                                {/* Emoji with smooth grayscale transition */}
                                <div
                                    className={cn(
                                        "w-8 h-8 md:w-10 md:h-10 transition-all duration-300 ease-out select-none flex items-center justify-center",
                                        isActive
                                            ? "grayscale-0 drop-shadow-lg scale-110"
                                            : "grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0",
                                    )}
                                >
                                    <img
                                        src={`https://emojicdn.elk.sh/${item.emoji}?style=apple`}
                                        alt={item.label}
                                        className="w-full h-full object-contain pointer-events-none"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            <div className="relative h-6 w-32">
                {/* Rating labels */}
                {ratingData.map((item, i) => (
                    <div
                        key={i}
                        className={cn(
                            "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out",
                            displayRating === i + 1 ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105",
                        )}
                    >
                        <span className="text-xs font-medium tracking-wide text-white/60">{item.label}</span>
                    </div>
                ))}
                {/* Default Empty State Text (Optional, or just hide) */}
                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out",
                        displayRating === 0 ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-95",
                    )}
                >
                    <span className="text-xs font-medium tracking-wide text-white/20">Select one</span>
                </div>
            </div>
        </div>
    )
}
