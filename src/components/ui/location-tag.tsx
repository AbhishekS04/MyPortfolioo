"use client"

import { useState, useEffect, useRef } from "react"
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

    const [isRetro, setIsRetro] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [warningText, setWarningText] = useState("");
    const pressTimer = useRef<NodeJS.Timeout | null>(null);

    const triggerRetroSequence = async () => {
        if (isRetro) {
            document.documentElement.classList.remove('retro-mode');
            setIsRetro(false);
            return;
        }

        // 1. Fade In Black Overlay
        setShowOverlay(true);
        // Heartbeat vibration pattern
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([100, 100, 100, 100]);

        const type = async (text: string, ms: number) => {
            setWarningText(text);
            await new Promise(r => setTimeout(r, ms));
        }

        // 2. DANGER Narrative
        await new Promise(r => setTimeout(r, 1000));

        await type("⚠️ SECURITY BREACH ⚠️", 2000);
        await type("⛔ UNAUTHORIZED BIOS ACCESS ⛔", 2500);
        await type("☠️ FATAL SYSTEM ERROR ☠️", 2000);
        await type("🚨 INITIATING EMERGENCY RESET...", 1500);

        // 3. Activate Global Retro Mode
        document.documentElement.classList.add('retro-mode');
        setIsRetro(true);

        // 4. Reveal
        setShowOverlay(false);
    };

    const handlePressStart = () => {
        pressTimer.current = setTimeout(() => {
            triggerRetroSequence();
        }, 800);
    };

    const handlePressEnd = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

    return (
        <>
            {/* Smooth Black Overlay */}
            <AnimatePresence>
                {showOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#050000] p-6 text-center select-none cursor-wait"
                    >
                        {/* Red Vignette */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(50,0,0,0.4)_100%)] pointer-events-none" />

                        {/* Text Container */}
                        <motion.div
                            key={warningText}
                            initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(2px)" }}
                            transition={{ duration: 0.4 }}
                            className="font-mono font-bold tracking-widest uppercase relative z-10"
                        >
                            <span className="text-red-600 text-xl md:text-2xl lg:text-3xl drop-shadow-[0_0_25px_rgba(220,38,38,0.9)]">
                                {warningText}
                            </span>
                        </motion.div>

                        {/* Intense Loading Element */}
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-1 bg-red-950/30 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="w-1/2 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,1)]"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                className={`group relative flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 transition-all duration-500 ease-out hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.04)] ${className}`}
            >
                <div className="relative flex items-center justify-center">
                    <span className="relative flex h-2 w-2">
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isRetro ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${isRetro ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    </span>
                </div>

                <div className="flex items-center gap-2 overflow-hidden">
                    <span
                        className="relative flex h-4 items-center overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {isRetro ? (
                                <motion.span
                                    key="retro"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="whitespace-nowrap text-xs font-bold text-amber-500 font-mono tracking-widest"
                                >
                                    SYSTEM OVERRIDE
                                </motion.span>
                            ) : !isHovered ? (
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
        </>
    )
}
