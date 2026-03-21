"use client";

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
// import { DottedMap } from "@/components/ui/dotted-map"
// import dynamic from "next/dynamic"

// const RealMap = dynamic(() => import("@/components/ui/real-map"), {
//     ssr: false,
//     loading: () => <div className="w-full h-full bg-[#242424] animate-pulse" />
// })

const BG_QUOTES = [
    {
        chapter: 2,
        verse: 47,
        sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
        english: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action."
    },
    {
        chapter: 2,
        verse: 14,
        sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
        english: "O son of Kunti, the nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons."
    },
    {
        chapter: 4,
        verse: 7,
        sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
        english: "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion—at that time I descend Myself."
    },
    {
        chapter: 6,
        verse: 5,
        sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
        english: "One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well."
    },
    {
        chapter: 2,
        verse: 22,
        sanskrit: "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि।\nतथा शरीराणि विहाय जीर्णा- न्यन्यानि संयाति नवानि देही॥",
        english: "As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones."
    },
    {
        chapter: 2,
        verse: 27,
        sanskrit: "जातस्य हि ध्रुवो मृत्युर्ध्रुवं जन्म मृतस्य च।\nतस्मादपरिहार्येऽर्थे न त्वं शोचितुमर्हसि॥",
        english: "One who has taken his birth is sure to die, and after death one is sure to take birth again. Therefore, in the unavoidable discharge of your duty, you should not lament."
    },
    {
        chapter: 3,
        verse: 19,
        sanskrit: "तस्मादसक्तः सततं कार्यं कर्म समाचर।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः॥",
        english: "Therefore, without being attached to the fruits of activities, one should act as a matter of duty, for by working without attachment one attains the Supreme."
    }
];

export function CraftCard() {
    const [clickCount, setClickCount] = useState(0)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [dailyQuote, setDailyQuote] = useState(BG_QUOTES[0])
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [cacheBuster, setCacheBuster] = useState("")

    useEffect(() => {
        const t = setTimeout(() => setCacheBuster(`?v=${Date.now()}`), 0);
        return () => clearTimeout(t);
    }, [])

    useEffect(() => {
        if (!isVideoPlaying && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isVideoPlaying]);

    const handleCardClick = () => {
        if (isVideoPlaying) return

        const newCount = clickCount + 1
        setClickCount(newCount)

        if (newCount >= 3) {
            setIsVideoPlaying(true)
            setIsMuted(false);
            if (videoRef.current) {
                videoRef.current.muted = false;
                videoRef.current.currentTime = 0;
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        if (videoRef.current) {
                            videoRef.current.muted = true;
                            setIsMuted(true);
                            videoRef.current.play().catch(() => {});
                        }
                    });
                }
            }
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            setClickCount(0)
        } else {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => {
                setClickCount(0)
            }, 2000)
        }
    }

    // Check for persisted state on mount
    useEffect(() => {
        let isMounted = true;
        Promise.resolve().then(() => {
            if (!isMounted) return;
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 0);
            const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
            const oneDay = 1000 * 60 * 60 * 24;
            const day = Math.floor(diff / oneDay);
            setDailyQuote(BG_QUOTES[Math.abs(day) % BG_QUOTES.length]);
        });

        /*
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
        */

        return () => { isMounted = false; };
    }, [])

    return (
        <div 
            onClick={handleCardClick}
            className="relative w-full h-full min-h-[180px] rounded-[32px] overflow-hidden border border-white/5 bg-[#111] flex flex-col items-center justify-center p-4 md:p-6 text-center cursor-pointer transition-colors duration-300 hover:bg-[#151515]"
        >
            {/* Video Easter Egg - Kept in DOM continually so mobile Safari synchronizes play gesture */}
            <div 
                className={`absolute inset-0 z-[100] w-full h-full bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out ${isVideoPlaying ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
                <video 
                    ref={videoRef}
                    src={`https://ik.imagekit.io/rwpr7hjrb/dogras.ftw_14050101_222620238.mp4${cacheBuster}`}
                    playsInline
                    muted={isMuted}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                    }}
                    onEnded={() => setIsVideoPlaying(false)}
                    className="w-full h-full object-cover opacity-90 cursor-pointer"
                />
            </div>

            {/* Click indicator dot (subtle feedback) */}
            {!isVideoPlaying && (
                <div className="absolute top-5 right-5 z-20 transition-opacity duration-300 opacity-70 pointer-events-none">
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${clickCount > 0 ? "bg-[#F97316]/70 shadow-[0_0_8px_rgba(249,115,22,0.8)]" : "bg-transparent"}`} />
                </div>
            )}

            {/* Quote Block seamlessly fades out when video plays */}
            <AnimatePresence mode="sync">
                {!isVideoPlaying && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="relative z-20 flex flex-col items-center justify-center w-full h-full max-w-2xl mx-auto pointer-events-none"
                    >
                        {/* Sanskrit Block */}
                        <h3 className="text-white font-medium text-sm md:text-base lg:text-lg leading-[1.6] whitespace-pre-line text-center px-1 md:px-4 font-sans drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
                            {dailyQuote.sanskrit}
                        </h3>
                        
                        {/* Divider */}
                        <div className="h-[1px] w-12 bg-white/20 my-3 lg:my-4" />
                        
                        {/* English Translation */}
                        <p className="text-white/80 text-xs md:text-sm lg:text-[0.95rem] text-center leading-[1.6] italic font-serif px-2 md:px-6 max-w-xl line-clamp-4">
                            &quot;{dailyQuote.english}&quot;
                        </p>

                        {/* Source */}
                        <p className="text-[#F97316] font-mono text-[10px] md:text-xs tracking-[0.05em] opacity-90 mt-3 lg:mt-4 font-semibold">
                            — Bhagavad Gita, Ch {dailyQuote.chapter}, V {dailyQuote.verse}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
