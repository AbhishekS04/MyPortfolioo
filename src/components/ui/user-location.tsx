"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { MapPin, Clock } from "lucide-react"

interface UserLocationProps {
    className?: string
}

export function UserLocation({ className = "" }: UserLocationProps) {
    const [location, setLocation] = useState({ city: "Kolkata", country: "India", timezone: "Asia/Kolkata" })
    const [showTime, setShowTime] = useState(false)
    const [currentTime, setCurrentTime] = useState("")


    useEffect(() => {
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
                // Format: "10:30 PM IST"
                const time = now.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: location.timezone,
                });

                // Explicitly use "IST" for Indian time for compactness
                const suffix = location.timezone.includes("Kolkata") ? " IST" : "";
                setCurrentTime(`${time}${suffix}`);
            } catch (e) {
                setCurrentTime("00:00 AM")
            }
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [location.timezone])

    return (
        <motion.button
            onMouseEnter={() => setShowTime(true)}
            onMouseLeave={() => setShowTime(false)}
            onBlur={() => setShowTime(false)}
            className={`group relative flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition-colors duration-300 hover:border-white/20 hover:bg-white/10 select-none touch-none overflow-hidden ${className}`}
        >
            <div className="relative flex items-center justify-center w-4 h-4">
                <AnimatePresence mode="popLayout" initial={false}>
                    {showTime ? (
                        <motion.div
                            key="clock"
                            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                            className="absolute inset-0 m-auto"
                        >
                            <Clock className="w-4 h-4 text-white/70" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="pin"
                            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                            className="absolute inset-0 m-auto"
                        >
                            <MapPin className="w-4 h-4 text-white/70" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="relative h-5 flex flex-col justify-center items-start w-full overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                    {showTime ? (
                        <motion.span
                            key="time"
                            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30
                            }}
                            className="text-sm font-medium text-white/90 font-sans block whitespace-nowrap absolute left-0"
                        >
                            {currentTime}
                        </motion.span>
                    ) : (
                        <motion.span
                            key="location"
                            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30
                            }}
                            className="text-sm font-medium text-white/90 font-sans block whitespace-nowrap absolute left-0"
                        >
                            {location.city}, {location.country}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    )
}
