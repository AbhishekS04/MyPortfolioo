"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

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

const STORIES: Story[] = [
    {
        id: "1",
        platform: "linkedin",
        mediaUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
        linkUrl: "https://www.linkedin.com/",
        duration: 5,
        date: "2h ago",
        caption: "Excited to share my latest project! #webdev"
    },
    {
        id: "2",
        platform: "instagram",
        mediaUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop",
        linkUrl: "https://www.instagram.com/",
        duration: 5,
        date: "5h ago",
        caption: "Behind the scenes 📸"
    },
    {
        id: "3",
        platform: "instagram",
        mediaUrl: "https://images.unsplash.com/photo-1516251193000-18e65848006b?q=80&w=2670&auto=format&fit=crop",
        linkUrl: "https://www.instagram.com/",
        duration: 5,
        date: "1d ago",
        caption: "Coding late night 🌙"
    }
]

export function SocialStories() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isImageLoaded, setIsImageLoaded] = useState(false) // Wait for image to load
    const [mounted, setMounted] = useState(false)

    // Store the start time of the current slice of progress
    const lastTimeRef = useRef<number>(Date.now())
    const progressRef = useRef(0)

    // Direct DOM manipulation ref for performance
    const activeProgressBarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    const currentStory = STORIES[currentIndex]
    // Default duration 5s if not specified
    const duration = (currentStory.duration || 5) * 1000

    const goToNext = useCallback(() => {
        if (currentIndex < STORIES.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            setCurrentIndex(0)
            setIsOpen(false)
        }
        progressRef.current = 0
        setIsImageLoaded(false) // Reset loading state for next story
    }, [currentIndex])

    const goToPrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
        progressRef.current = 0
        setIsImageLoaded(false) // Reset loading state
    }, [currentIndex])

    useEffect(() => {
        // Reset timing when index changes
        lastTimeRef.current = Date.now()
        progressRef.current = 0
    }, [currentIndex])

    useEffect(() => {
        if (!isOpen) return

        let animationFrameId: number

        const animate = () => {
            // Only progress if not paused AND image is fully loaded
            if (!isPaused && isImageLoaded) {
                const now = Date.now()
                const delta = now - lastTimeRef.current
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
    }, [isPaused, duration, goToNext, isOpen, currentIndex, isImageLoaded])

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
        setIsOpen(!isOpen)
    }

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
                                <Image src={"https://github.com/shadcn.png"} alt="User" fill className="object-cover" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Portal for Expanded View */}
            {mounted && createPortal(
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
                                    {!isImageLoaded && (
                                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
                                            <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                                        </div>
                                    )}

                                    {/* Background Image */}
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentStory.id}
                                            initial={{ opacity: 0.6, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0.6 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 z-0"
                                        >
                                            <Image
                                                src={currentStory.mediaUrl}
                                                alt={currentStory.caption || "Story"}
                                                fill
                                                className="object-cover"
                                                priority
                                                onLoad={() => setIsImageLoaded(true)}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-10 flex flex-col p-5">
                                        {/* Progress Bars */}
                                        <div className="flex gap-1.5 mb-4">
                                            {STORIES.map((story, idx) => (
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
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden relative">
                                                    <Image src={"https://github.com/shadcn.png"} alt="User" fill className="object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-semibold text-xs leading-none">Antigravity</span>
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
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white/80 hover:bg-black/40 hover:text-white transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex-1" />

                                        {/* Footer */}
                                        <div className="flex items-end justify-between gap-4 pb-1">
                                            <p className="text-white/90 text-sm font-medium line-clamp-3 drop-shadow-md flex-1">
                                                {currentStory.caption}
                                            </p>

                                            <a
                                                href={currentStory.linkUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
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
