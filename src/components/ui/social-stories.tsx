"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, X, Loader2, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
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

const PROFILE = {
    name: "Abhishek Singh",
    avatarUrl: "https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/68e0efce-84a4-42ae-9bd7-a2be6aca73d8.jpg",
}

export function SocialStories({ id = "default" }: { id?: string }) {
    const [stories, setStories] = useState<Story[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isMediaLoaded, setIsMediaLoaded] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [dynamicDuration, setDynamicDuration] = useState<number | null>(null)
    const [isFetchLoading, setIsFetchLoading] = useState(true)
    const [isMuted, setIsMuted] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)

    const currentStory = stories[currentIndex]

    // Preload video URLs in the background as soon as stories are fetched
    useEffect(() => {
        stories.forEach(s => {
            if (isVideoUrl(s.mediaUrl)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'video';
                link.href = s.mediaUrl;
                document.head.appendChild(link);
            }
        });
    }, [stories]);

    // Force video playback on mount/story change (critical for Android)
    useEffect(() => {
        if (!isOpen || !currentStory) return;
        if (!isVideoUrl(currentStory.mediaUrl)) return;

        // Try multiple times with increasing delays (Android needs DOM to settle)
        const attempts = [50, 200, 500];
        const timers = attempts.map((delay) =>
            setTimeout(() => {
                const video = videoRef.current;
                if (!video || !video.paused) return;

                // Force muted attribute at DOM level (Android requirement)
                video.setAttribute('muted', '');
                video.muted = true;

                video.play().catch(() => {
                    video.load();
                    video.play().catch(() => {});
                });
            }, delay)
        );

        return () => timers.forEach(clearTimeout);
    }, [isOpen, currentIndex, currentStory]);

    // Timing refs for high-performance animation
    const startTimeRef = useRef<number | null>(null)
    const pausedAtRef = useRef<number | null>(null)
    const rafRef = useRef<number | null>(null)
    const lastTimeRef = useRef<number>(Date.now())
    const progressRef = useRef(0)

    // Direct DOM manipulation ref for performance
    const activeProgressBarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
        fetchStories()
    }, [])

    const fetchStories = async () => {
        setIsFetchLoading(true)
        try {
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
        } finally {
            setIsFetchLoading(false)
        }
    }

    // Priority: Dynamic (video detected) > DB provided > Default (5s)
    const defaultDuration = 5
    const durationMs = dynamicDuration ?? (currentStory?.duration ?? defaultDuration) * 1000

    const stopAnimation = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
    }

    const resetTiming = () => {
        startTimeRef.current = null
        // pausedAtRef.current = null // Not used in current draft but good to reset if added back
        setIsMediaLoaded(false)
        if (activeProgressBarRef.current) {
            activeProgressBarRef.current.style.width = "0%"
        }
        progressRef.current = 0
    }

    const isVideoUrl = (url: string) => {
        if (!url) return false;
        const cleanUrl = url.split('?')[0];
        return /\.(mp4|webm|ogg|mov|m4v)$/i.test(cleanUrl) || /\/video\/upload\//i.test(url);
    };

    const getVideoMimeType = (url: string): string => {
        const cleanUrl = url.split('?')[0].toLowerCase();
        if (cleanUrl.endsWith('.webm')) return 'video/webm';
        if (cleanUrl.endsWith('.ogg')) return 'video/ogg';
        if (cleanUrl.endsWith('.mov')) return 'video/quicktime';
        if (cleanUrl.endsWith('.m4v')) return 'video/x-m4v';
        return 'video/mp4';
    };

    const goToNext = useCallback(() => {
        stopAnimation()
        resetTiming()
        setDynamicDuration(null)

        if (currentIndex < stories.length - 1) {
            setCurrentIndex(i => i + 1)
        } else {
            setIsOpen(false)
            setCurrentIndex(0)
        }
    }, [currentIndex, stories.length])

    const goToPrev = useCallback(() => {
        if (currentIndex === 0) return
        stopAnimation()
        resetTiming()
        setDynamicDuration(null)
        setCurrentIndex(i => i - 1)
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
                const progressPercent = Math.min((progressRef.current / durationMs) * 100, 100)

                if (activeProgressBarRef.current) {
                    activeProgressBarRef.current.style.width = `${progressPercent}%`
                }

                if (progressRef.current >= durationMs) {
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
    }, [isPaused, durationMs, goToNext, isOpen, currentIndex, isMediaLoaded, currentStory])

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
    // removed early return to show trigger immediately

    const isCurrentVideo = currentStory ? isVideoUrl(currentStory.mediaUrl) : false;

    return (
        <>
            {/* Trigger in Navbar - Gold Border Ring */}
            <div className="w-full h-full relative flex items-center justify-center z-50 group">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            // Removed layoutId to prevent visibility conflics
                            key="trigger"
                            className={cn(
                                "absolute inset-0 cursor-pointer rounded-full overflow-hidden transition-all duration-300",
                                // Gold border integration
                                "border-[1.5px]",
                                isFetchLoading
                                    ? "border-white/10 opacity-50 grayscale"
                                    : "border-[#007AFF] hover:border-[#007AFF] opacity-100 grayscale-0 shadow-[0_0_10px_rgba(0,122,255,0.3)]"
                            )}
                            onClick={() => !isFetchLoading && stories.length > 0 && setIsOpen(true)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image
                                src={PROFILE.avatarUrl}
                                alt={PROFILE.name}
                                fill
                                className="object-cover p-[2px] rounded-full" // Slight padding inside border
                                priority
                            />

                            {/* Loading / Active Pulse Overlay */}
                            {isFetchLoading && (
                                <motion.div
                                    className="absolute inset-0 bg-white/10"
                                    animate={{ opacity: [0, 0.2, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
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
                                key="card"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
                                    onTouchEnd={(e) => {
                                        setIsPaused(false)
                                        // On mobile, re-trigger video play after touch
                                        if (videoRef.current && videoRef.current.paused) {
                                            videoRef.current.play().catch(() => {});
                                        }
                                    }}
                                >
                                    {/* Loading State */}
                                    {!isMediaLoaded && (
                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black gap-3">
                                            <Loader2 className="w-10 h-10 text-white/60 animate-spin" />
                                            <span className="text-white/40 text-xs">Loading...</span>
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
                                                    ref={(el) => {
                                                        (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
                                                        // Force muted attribute at DOM level immediately on mount
                                                        if (el) {
                                                            el.setAttribute('muted', '');
                                                            el.muted = true;
                                                        }
                                                    }}
                                                    key={currentStory.id}
                                                    src={currentStory.mediaUrl}
                                                    autoPlay
                                                    playsInline
                                                    muted
                                                    preload="auto"
                                                    className="w-full h-full object-contain"
                                                    onCanPlay={(e) => {
                                                        const video = e.currentTarget;
                                                        setIsMediaLoaded(true);
                                                        // Force play on canplay (fires before loadeddata, more reliable on Android)
                                                        video.play().catch(() => {
                                                            video.muted = true;
                                                            video.play().catch(() => {});
                                                        });
                                                    }}
                                                    onLoadedMetadata={(e) => {
                                                        const video = e.currentTarget;
                                                        setDynamicDuration(video.duration * 1000);
                                                    }}
                                                    onError={(e) => {
                                                        console.warn('Story video failed to load:', currentStory.mediaUrl);
                                                        setIsMediaLoaded(true);
                                                    }}
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

                                            <div className="flex items-center gap-2">
                                                {/* Mute/Unmute Toggle */}
                                                {isCurrentVideo && (
                                                    <motion.button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            const newMuted = !isMuted
                                                            setIsMuted(newMuted)
                                                            if (videoRef.current) {
                                                                videoRef.current.muted = newMuted
                                                            }
                                                        }}
                                                        aria-label={isMuted ? "Tap to unmute" : "Tap to mute"}
                                                        className={cn(
                                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md transition-colors",
                                                            isMuted
                                                                ? "bg-white/20 text-white"
                                                                : "bg-white/10 text-white/80"
                                                        )}
                                                        initial={isMuted ? { scale: 1 } : undefined}
                                                        animate={isMuted ? { scale: [1, 1.1, 1] } : undefined}
                                                        transition={isMuted ? { duration: 1.5, repeat: Infinity, repeatDelay: 2 } : undefined}
                                                    >
                                                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                                        <span className="text-[10px] font-medium">{isMuted ? "Tap for sound" : "Sound on"}</span>
                                                    </motion.button>
                                                )}

                                                {/* Close Button */}
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
