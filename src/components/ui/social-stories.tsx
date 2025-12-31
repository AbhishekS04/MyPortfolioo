"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

export type SocialPlatform = "linkedin" | "instagram"

export interface Story {
    id: string
    platform: SocialPlatform
    mediaUrl: string
    linkUrl: string
    duration?: number // duration in seconds
    date?: string
    caption?: string
}

const PROFILE = {
    name: "Abhishek Singh",
    avatarUrl: "https://res.cloudinary.com/dap0u41dz/image/upload/v1766771167/file_00000000d51472078b7e2f9d883a6674_majhmb.jpg",
}

export function SocialStories() {
    const [stories, setStories] = useState<Story[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isMediaLoaded, setIsMediaLoaded] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Store the start time of the current slice of progress
    const lastTimeRef = useRef<number>(Date.now())
    const progressRef = useRef(0)

    // Direct DOM manipulation ref for performance
    const activeProgressBarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
        fetchStories()
    }, [])

    const fetchStories = async () => {
        const { data } = await supabase
            .from("social_stories")
            .select("*")
            .order("display_order", { ascending: true })

        if (data) {
            setStories(data.map(s => ({
                id: s.id,
                platform: s.platform as SocialPlatform,
                mediaUrl: s.media_url,
                linkUrl: s.link_url,
                caption: s.caption,
                duration: 5
            })))
        }
    }

    const currentStory = stories[currentIndex]

    // Default duration 5s if not specified
    const duration = (currentStory?.duration || 5) * 1000

    const isVideoUrl = (url: string) => {
        return url.match(/\.(mp4|webm|ogg|mov|m4v)$|^https?:\/\/res\.cloudinary\.com\/.*\/video\/upload\//i);
    };

    const goToNext = useCallback(() => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            setCurrentIndex(0)
            setIsOpen(false)
        }
        progressRef.current = 0
        setIsMediaLoaded(false)
    }, [currentIndex, stories.length])

    const goToPrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
        progressRef.current = 0
        setIsMediaLoaded(false)
    }, [currentIndex])

    useEffect(() => {
        // Reset timing when index changes
        lastTimeRef.current = Date.now()
        progressRef.current = 0
    }, [currentIndex])

    useEffect(() => {
        if (!isOpen || !currentStory) return

        let animationFrameId: number

        const animate = () => {
            if (!isPaused && isMediaLoaded) {
                const now = Date.now()
                // Limit delta to prevent huge jumps if tab was inactive
                const delta = Math.min(now - lastTimeRef.current, 100)
                lastTimeRef.current = now

                progressRef.current += delta
                const progressPercent = Math.min((progressRef.current / duration) * 100, 100)

                if (activeProgressBarRef.current) {
                    activeProgressBarRef.current.style.width = `${progressPercent}%`
                }

                if (progressRef.current >= duration) {
                    goToNext()
                }
            } else {
                lastTimeRef.current = Date.now()
            }

            animationFrameId = requestAnimationFrame(animate)
        }

        animationFrameId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [isPaused, duration, goToNext, isOpen, currentIndex, isMediaLoaded, currentStory])

    const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('button')) {
            return
        }

        const width = e.currentTarget.offsetWidth
        const x = e.nativeEvent.offsetX

        if (x < width / 3) {
            goToPrev()
        } else {
            goToNext()
        }
    }

    const toggleOpen = () => {
        if (stories.length > 0) {
            setIsOpen(!isOpen)
        }
    }

    if (!mounted) return null
    if (stories.length === 0) return null
    if (!currentStory) return null

    const isCurrentVideo = isVideoUrl(currentStory.mediaUrl);

    return (
        <>
            {/* Trigger in Navbar - Gold Border, No Glow */}
            <div className="w-10 h-10 relative flex items-center justify-center z-50 group">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            layoutId="story-container"
                            className="absolute inset-0 cursor-pointer rounded-full p-[2px]"
                            onClick={toggleOpen}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Gold Border Ring */}
                            <div className="absolute inset-0 rounded-full border-[2px] border-[#FFD700]/80 group-hover:border-[#FFD700] transition-colors shadow-[0_0_10px_rgba(255,215,0,0.2)]" />

                            <div className="absolute inset-[3px] rounded-full bg-black flex items-center justify-center overflow-hidden">
                                <Image src={PROFILE.avatarUrl} alt={PROFILE.name} fill className="object-cover" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Portal for Expanded View */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                                onClick={() => setIsOpen(false)}
                            />

                            {/* Card - Responsive Size */}
                            <motion.div
                                layoutId="story-container"
                                className="relative w-[90vw] h-[65vh] md:w-[380px] md:h-[650px] bg-black rounded-[32px] overflow-hidden shadow-2xl z-10"
                                drag="y"
                                dragConstraints={{ top: 0, bottom: 0 }}
                                onDragEnd={(e, { offset, velocity }) => {
                                    if (offset.y > 100 || velocity.y > 500) {
                                        setIsOpen(false)
                                    }
                                }}
                            >
                                <div className="absolute inset-0 w-full h-full"
                                    onMouseEnter={() => setIsPaused(true)}
                                    onMouseLeave={() => setIsPaused(false)}
                                    onMouseDown={() => setIsPaused(true)}
                                    onMouseUp={(e) => {
                                        setIsPaused(false)
                                        handleTap(e)
                                    }}
                                    onTouchStart={() => setIsPaused(true)}
                                    onTouchEnd={() => setIsPaused(false)}
                                >
                                    {/* Loading State Spinner */}
                                    {!isMediaLoaded && (
                                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
                                            <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                                        </div>
                                    )}

                                    {/* Background Media */}
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentStory.id}
                                            initial={{ opacity: 0.6, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0.6 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 z-0"
                                        >
                                            {isCurrentVideo ? (
                                                <video
                                                    src={currentStory.mediaUrl}
                                                    autoPlay
                                                    playsInline
                                                    loop
                                                    className="w-full h-full object-contain"
                                                    onLoadedData={() => setIsMediaLoaded(true)}
                                                />
                                            ) : (
                                                <Image
                                                    src={currentStory.mediaUrl}
                                                    alt={currentStory.caption || "Story"}
                                                    fill
                                                    className="object-cover"
                                                    priority
                                                    onLoad={() => setIsMediaLoaded(true)}
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-10 flex flex-col p-5 pointer-events-none">
                                        {/* Progress Bars */}
                                        <div className="flex gap-1.5 mb-4">
                                            {stories.map((story, idx) => (
                                                <div key={story.id} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                                                    <div
                                                        ref={idx === currentIndex ? activeProgressBarRef : null}
                                                        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-100 ease-linear rounded-full"
                                                        style={{
                                                            width: idx < currentIndex ? "100%" : "0%"
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Header */}
                                        <div className="flex items-center justify-between pointer-events-auto">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden relative">
                                                    <Image src={PROFILE.avatarUrl} alt={PROFILE.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-semibold text-xs leading-none">{PROFILE.name}</span>
                                                    <span className="text-white/60 text-[10px] leading-none mt-0.5">
                                                        {currentStory.platform === 'linkedin' ? 'via LinkedIn' : 'via Instagram'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Toggle Close Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setIsOpen(false)
                                                }}
                                                aria-label="Close Story"
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white/80 hover:bg-black/40 hover:text-white transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex-1" />

                                        {/* Footer */}
                                        <div className="flex items-end justify-between gap-4 pb-1 pointer-events-auto">
                                            <p className="text-white/90 text-sm font-medium line-clamp-3 drop-shadow-md flex-1">
                                                {currentStory.caption}
                                            </p>

                                            <a
                                                href={currentStory.linkUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Visit Story Link"
                                                className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all shadow-lg group/btn"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <ArrowUpRight className="w-5 h-5 group-hover/btn:rotate-45 transition-transform duration-300" strokeWidth={2.5} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}
