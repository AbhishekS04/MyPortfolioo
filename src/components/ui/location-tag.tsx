"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"

interface LocationTagProps {
    className?: string
}

export function LocationTag({ className = "" }: LocationTagProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [currentTime, setCurrentTime] = useState("")
    const [location, setLocation] = useState({ city: "Kolkata", country: "India", timezone: "Asia/Kolkata" })

    useEffect(() => {
        // Fetch location data
        const fetchLocation = async () => {
            const { data } = await supabase.from("profile").select("location_city, location_country, location_timezone").single();
            if (data) {
                setLocation({
                    city: data.location_city || "Kolkata",
                    country: data.location_country || "India",
                    timezone: data.location_timezone || "Asia/Kolkata"
                });
            }
        };
        fetchLocation();
    }, []);

    useEffect(() => {
        const updateTime = () => {
            try {
                const now = new Date()
                setCurrentTime(
                    now.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: location.timezone,
                    }),
                )
            } catch (e) {
                // Fallback for invalid timezone
                setCurrentTime("00:00")
            }
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [location.timezone])

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
                    className="relative flex h-4 items-center overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {!isHovered ? (
                            <motion.span
                                key="location"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="whitespace-nowrap text-xs font-medium text-white/90"
                            >
                                {location.city}, {location.country}
                            </motion.span>
                        ) : (
                            <motion.span
                                key="time"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="whitespace-nowrap text-xs font-medium text-white/90"
                            >
                                {currentTime} <span className="text-white/40">{new Date().toLocaleTimeString('en-us', { timeZoneName: 'short', timeZone: location.timezone }).split(' ')[2]}</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </span>
            </div>
        </button>
    )
}
