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
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [terminalColor, setTerminalColor] = useState<'gray' | 'green'>('gray');
    const pressTimer = useRef<NodeJS.Timeout | null>(null);

    const triggerRetroSequence = async () => {
        if (isRetro) {
            document.documentElement.classList.remove('retro-mode');
            setIsRetro(false);
            return;
        }

        setShowOverlay(true);
        setTerminalLines([]);
        setTerminalColor('gray');

        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);

        const addLine = async (line: string, delay: number) => {
            setTerminalLines(prev => [...prev, line]);
            if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
            await new Promise(r => setTimeout(r, delay));
        }

        // DESTRUCTION PHASE (Gray)
        await new Promise(r => setTimeout(r, 500));

        await addLine("> ROOT_ACCESS_GRANTED", 400);
        await addLine("> EXECUTING: sudo rm -rf /portfolio_v2", 800);
        await addLine("> DELETING_ASSETS...", 400);
        await addLine("> DELETING_STYLES...", 400);
        await addLine("> REMOVING_OPERATING_SYSTEM...", 600);

        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([50, 50, 100]);
        await addLine("> SYSTEM_CRITICAL: OS_NOT_FOUND", 1200);

        // REBIRTH PHASE (Green)
        setTerminalColor('green');
        await addLine("> BOOTING_LEGACY_KERNEL...", 800);
        await addLine("> LOADING_BIOS_v1998...", 500);
        await addLine("> CHECKING_VRAM... [OK]", 400);
        await addLine("> STARTING_OS...", 1500);

        // Activate Retro Mode
        document.documentElement.classList.add('retro-mode');
        setIsRetro(true);

        setShowOverlay(false);
    };

    const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
        pressTimer.current = setTimeout(() => {
            triggerRetroSequence();
        }, 800);
    };

    const handlePressEnd = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

    return (
        <>
            {/* Terminal Overlay */}
            <AnimatePresence>
                {showOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`fixed inset-0 z-[100000] bg-black p-6 md:p-20 font-mono overflow-hidden cursor-wait flex flex-col justify-start items-start transition-colors duration-500 ${terminalColor === 'green' ? 'text-[#33ff00] drop-shadow-[0_0_8px_rgba(51,255,0,0.4)]' : 'text-gray-300'}`}
                    >
                        <div className="w-full max-w-4xl space-y-1 text-xs md:text-lg uppercase">
                            {terminalLines.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="break-all md:break-words whitespace-pre-wrap"
                                >
                                    {line}
                                </motion.div>
                            ))}

                            {/* Blinking Cursor */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2"
                            >
                                <span className={terminalColor === 'green' ? 'text-[#33ff00]' : 'text-gray-500'}>{'>'}</span>
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className={`inline-block w-2 h-4 md:w-3 md:h-5 ml-2 align-middle ${terminalColor === 'green' ? 'bg-[#33ff00]' : 'bg-gray-300'}`}
                                />
                            </motion.div>
                        </div>

                        {/* Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none select-none opacity-10" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, #ffffff 4px)" }}></div>
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
                onContextMenu={(e) => e.preventDefault()}
                style={{ WebkitTouchCallout: 'none' }}
                className={`group relative flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition-all duration-300 hover:border-white/20 hover:bg-white/10 select-none touch-none ${className}`}
            >
                <div className="relative flex items-center justify-center">
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isRetro ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${isRetro ? 'bg-amber-500' : 'bg-emerald-500'}`} />


                </div>

                <div className="relative overflow-hidden h-5 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={isRetro ? "retro" : "standard"}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`text-sm font-medium block ${isRetro ? 'font-mono text-amber-500' : 'font-sans text-white/90'}`}
                        >
                            {isRetro ? "SYSTEM OVERRIDE" : "Available for hire"}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </button>
        </>
    )
}
