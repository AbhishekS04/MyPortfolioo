"use client";

import { useState, useRef, useEffect } from "react"
import { DottedMap } from "@/components/ui/dotted-map"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"

const RealMap = dynamic(() => import("@/components/ui/real-map"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#242424] animate-pulse" />
})

export function CraftCard() {
    const [clickCount, setClickCount] = useState(0)
    const [showRealMap, setShowRealMap] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Check for persisted state on mount and preload map
    useEffect(() => {
        // Preload the RealMap component chunk
        import("@/components/ui/real-map");

        const checkPersistence = () => {
            const expiry = localStorage.getItem("mapEggExpiry")
            if (expiry) {
                const timeLeft = parseInt(expiry) - Date.now()
                if (timeLeft > 0) {
                    setShowRealMap(true)
                    // Set timeout for remaining time
                    timeoutRef.current = setTimeout(() => {
                        setShowRealMap(false)
                        setClickCount(0)
                        localStorage.removeItem("mapEggExpiry")
                    }, timeLeft)
                } else {
                    localStorage.removeItem("mapEggExpiry")
                }
            }
        }
        checkPersistence()
    }, [])

    const handleCardClick = () => {
        if (showRealMap) return

        const newCount = clickCount + 1
        setClickCount(newCount)

        // Preload the map implementation on first click to improve "instant" feel
        if (newCount === 1) {
            // Trigger a preload if possible, or just let dynamic import handle it naturally
            // A simple way is to conditionally render a hidden instance, but preventing SSR issues is key.
            // For now, we rely on the dynamic import.
        }

        if (newCount >= 3) {
            setShowRealMap(true)

            // Persist state for 40 seconds
            const duration = 40000
            localStorage.setItem("mapEggExpiry", (Date.now() + duration).toString())

            if (timeoutRef.current) clearTimeout(timeoutRef.current)

            // Revert to dotted map after 40 seconds
            timeoutRef.current = setTimeout(() => {
                setShowRealMap(false)
                setClickCount(0)
                localStorage.removeItem("mapEggExpiry")
            }, duration)
        } else {
            // Reset count if no clicks for 2 seconds
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => {
                setClickCount(0)
            }, 2000)
        }
    }

    return (
        <div
            onClick={handleCardClick}
            className="relative w-full h-full min-h-[180px] rounded-[32px] overflow-hidden group border border-white/5 bg-[#111] cursor-pointer"
        >
            <div className="absolute inset-0 flex items-center justify-center opacity-90 transition-opacity duration-100">
                <AnimatePresence>
                    {showRealMap && (
                        <motion.div
                            key="real-map"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }} // Slower, smoother fade
                            className="absolute inset-0 z-10 w-full h-full bg-[#111]" // Ensure background covers dotted map
                        >
                            <RealMap />
                        </motion.div>
                    )}

                    {!showRealMap && (
                        <motion.div
                            key="dotted-map"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full flex items-center justify-center"
                        >
                            <DottedMap
                                className="text-white/40 w-full max-w-[6000px]"
                                markers={[{ lat: 20.6, lng: 78.96, size: 0.8 }]}
                                markerColor="#F97316"
                                dotRadius={0.2}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!showRealMap && (
                <div className="absolute top-4 right-4 z-20">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${clickCount > 0 ? "bg-orange-500/50" : "bg-transparent"}`} />
                </div>
            )}
        </div>
    )
}
