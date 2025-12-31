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
    caption?: string
    duration?: number
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
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [mounted, setMounted] = useState(false)

    const activeProgressBarRef = useRef<HTMLDivElement>(null)
    const startTimeRef = useRef<number | null>(null)
    const pausedAtRef = useRef<number | null>(null)
    const rafRef = useRef<number | null>(null)

    const currentStory = stories[currentIndex]
    const defaultDuration = 5
    const durationMs = (currentStory?.duration ?? defaultDuration) * 1000

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

    const stopAnimation = () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
    }

    const resetTiming = () => {
        startTimeRef.current = null
        pausedAtRef.current = null
        setIsImageLoaded(false)
        if (activeProgressBarRef.current) {
            activeProgressBarRef.current.style.width = "0%"
        }
    }

    const goNext = useCallback(() => {
        stopAnimation()
        resetTiming()

        if (currentIndex < stories.length - 1) {
            setCurrentIndex(i => i + 1)
        } else {
            setIsOpen(false)
            setCurrentIndex(0)
        }
    }, [currentIndex, stories.length])

    const goPrev = useCallback(() => {
        if (currentIndex === 0) return
        stopAnimation()
        resetTiming()
        setCurrentIndex(i => i - 1)
    }, [currentIndex])

    useEffect(() => {
        if (!isOpen || !currentStory || !isImageLoaded) return

        const animate = (now: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = now
            }

            if (!isPaused) {
                const elapsed = now - startTimeRef.current
                const progress = Math.min(elapsed / durationMs, 1)

                if (activeProgressBarRef.current) {
                    activeProgressBarRef.current.style.width = `${progress * 100}%`
                }

                if (progress >= 1) {
                    stopAnimation()
                    requestAnimationFrame(goNext)
                    return
                }
            }

            rafRef.current = requestAnimationFrame(animate)
        }

        rafRef.current = requestAnimationFrame(animate)

        return () => stopAnimation()
    }, [
        isOpen,
        isPaused,
        isImageLoaded,
        durationMs,
        goNext,
        currentIndex,
        currentStory
    ])

    useEffect(() => {
        if (isPaused && pausedAtRef.current === null) {
            pausedAtRef.current = performance.now()
        }

        if (!isPaused && pausedAtRef.current !== null) {
            const delta = performance.now() - pausedAtRef.current
            if (startTimeRef.current !== null) {
                startTimeRef.current += delta
            }
            pausedAtRef.current = null
        }
    }, [isPaused])

    const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("button")) return
        const { width } = e.currentTarget.getBoundingClientRect()
        e.nativeEvent.offsetX < width / 3 ? goPrev() : goNext()
    }

    if (!mounted || stories.length === 0 || !currentStory) return null

    return (
        <>
            {/* Trigger */}
            <div className="w-10 h-10 relative">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            layoutId="story-container"
                            onClick={() => setIsOpen(true)}
                            className="absolute inset-0 rounded-full p-[2px] cursor-pointer group"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <div className="absolute inset-0 rounded-full border-2 border-yellow-400 group-hover:border-yellow-300 transition-colors shadow-[0_0_15px_rgba(250,204,21,0.2)]" />
                            <div className="absolute inset-[3px] rounded-full overflow-hidden bg-black">
                                <Image
                                    src={PROFILE.avatarUrl}
                                    alt={PROFILE.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modal */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center">
                            <motion.div
                                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                                onClick={() => setIsOpen(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            />

                            <motion.div
                                layoutId="story-container"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="
                  relative
                  w-[92vw]
                  max-w-[400px]
                  h-[75vh]
                  md:h-[700px]
                  bg-black
                  rounded-[32px]
                  overflow-hidden
                  shadow-2xl
                  z-10
                "
                            >
                                <div
                                    className="absolute inset-0 h-full w-full"
                                    onMouseEnter={() => setIsPaused(true)}
                                    onMouseLeave={() => setIsPaused(false)}
                                    onMouseDown={() => setIsPaused(true)}
                                    onMouseUp={handleTap}
                                    onTouchStart={() => setIsPaused(true)}
                                    onTouchEnd={() => setIsPaused(false)}
                                >
                                    {!isImageLoaded && (
                                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                                            <Loader2 className="animate-spin text-white/50 w-8 h-8" />
                                        </div>
                                    )}

                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentStory.id}
                                            initial={{ opacity: 0.8 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0.8 }}
                                            transition={{ duration: 0.4 }}
                                            className="absolute inset-0"
                                        >
                                            <Image
                                                src={currentStory.mediaUrl}
                                                alt="Story"
                                                fill
                                                priority
                                                sizes="(max-width: 768px) 100vw, 400px"
                                                className="object-cover object-center"
                                                onLoad={() => setIsImageLoaded(true)}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Progress bars */}
                                    <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-30">
                                        {stories.map((_, i) => (
                                            <div key={i} className="h-0.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                                                <div
                                                    ref={i === currentIndex ? activeProgressBarRef : null}
                                                    className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                                    style={{
                                                        width: i < currentIndex ? "100%" : "0%",
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Header */}
                                    <div className="absolute top-10 left-4 right-4 flex justify-between items-center z-30">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 border border-white/20 rounded-full overflow-hidden relative">
                                                <Image
                                                    src={PROFILE.avatarUrl}
                                                    alt={PROFILE.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white text-xs font-semibold leading-tight">
                                                    {PROFILE.name}
                                                </span>
                                                <span className="text-white/50 text-[10px]">
                                                    {currentStory.platform === "linkedin" ? "via LinkedIn" : "via Instagram"}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setIsOpen(false)
                                            }}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white/70 hover:text-white transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Footer */}
                                    <div className="absolute bottom-6 left-5 right-5 flex items-end gap-4 z-30">
                                        <p className="text-white text-sm font-medium flex-1 line-clamp-3 leading-relaxed drop-shadow-lg">
                                            {currentStory.caption}
                                        </p>
                                        <a
                                            href={currentStory.linkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all group/link"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ArrowUpRight className="w-6 h-6 group-hover/link:rotate-45 transition-transform duration-300" />
                                        </a>
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







// incase need to revert

//  "use client"

// import { useState, useEffect, useCallback, useRef } from "react"
// import { createPortal } from "react-dom"
// import { motion, AnimatePresence } from "framer-motion"
// import { ArrowUpRight, X, Loader2 } from "lucide-react"
// import Image from "next/image"
// import { cn } from "@/lib/utils"
// import { supabase } from "@/lib/supabase"

// export type SocialPlatform = "linkedin" | "instagram"

// export interface Story {
//     id: string
//     platform: SocialPlatform
//     mediaUrl: string
//     linkUrl: string
//     duration?: number // duration in seconds
//     date?: string
//     caption?: string
// }

// export function SocialStories() {
//     const [stories, setStories] = useState<Story[]>([])
//     const [isOpen, setIsOpen] = useState(false)
//     const [currentIndex, setCurrentIndex] = useState(0)
//     const [isPaused, setIsPaused] = useState(false)
//     const [isImageLoaded, setIsImageLoaded] = useState(false)
//     const [mounted, setMounted] = useState(false)

//     // Store the start time of the current slice of progress
//     const lastTimeRef = useRef<number>(Date.now())
//     const progressRef = useRef(0)

//     // Direct DOM manipulation ref for performance
//     const activeProgressBarRef = useRef<HTMLDivElement>(null)

//     useEffect(() => {
//         setMounted(true)
//         fetchStories()
//     }, [])

//     const fetchStories = async () => {
//         const { data } = await supabase
//             .from("social_stories")
//             .select("*")
//             .order("display_order", { ascending: true })

//         if (data) {
//             setStories(data.map(s => ({
//                 id: s.id,
//                 platform: s.platform as SocialPlatform,
//                 mediaUrl: s.media_url,
//                 linkUrl: s.link_url,
//                 caption: s.caption,
//                 duration: 5
//             })))
//         }
//     }

//     const currentStory = stories[currentIndex]

//     // Default duration 5s if not specified
//     // Safe access using optional chaining because currentStory might be undefined initially
//     const duration = (currentStory?.duration || 5) * 1000

//     const goToNext = useCallback(() => {
//         if (currentIndex < stories.length - 1) {
//             setCurrentIndex(prev => prev + 1)
//         } else {
//             setCurrentIndex(0)
//             setIsOpen(false)
//         }
//         progressRef.current = 0
//         setIsImageLoaded(false)
//     }, [currentIndex, stories.length])

//     const goToPrev = useCallback(() => {
//         if (currentIndex > 0) {
//             setCurrentIndex(prev => prev - 1)
//         }
//         progressRef.current = 0
//         setIsImageLoaded(false)
//     }, [currentIndex])

//     useEffect(() => {
//         // Reset timing when index changes
//         lastTimeRef.current = Date.now()
//         progressRef.current = 0
//     }, [currentIndex])

//     useEffect(() => {
//         if (!isOpen || !currentStory) return

//         let animationFrameId: number

//         const animate = () => {
//             if (!isPaused && isImageLoaded) {
//                 const now = Date.now()
//                 // Limit delta to prevent huge jumps if tab was inactive
//                 const delta = Math.min(now - lastTimeRef.current, 100)
//                 lastTimeRef.current = now

//                 progressRef.current += delta
//                 const progressPercent = Math.min((progressRef.current / duration) * 100, 100)

//                 if (activeProgressBarRef.current) {
//                     activeProgressBarRef.current.style.width = `${progressPercent}%`
//                 }

//                 if (progressRef.current >= duration) {
//                     goToNext()
//                 }
//             } else {
//                 lastTimeRef.current = Date.now()
//             }

//             animationFrameId = requestAnimationFrame(animate)
//         }

//         animationFrameId = requestAnimationFrame(animate)

//         return () => {
//             cancelAnimationFrame(animationFrameId)
//         }
//     }, [isPaused, duration, goToNext, isOpen, currentIndex, isImageLoaded, currentStory])

//     const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
//         if ((e.target as HTMLElement).closest('button')) {
//             return
//         }

//         const width = e.currentTarget.offsetWidth
//         const x = e.nativeEvent.offsetX

//         if (x < width / 3) {
//             goToPrev()
//         } else {
//             goToNext()
//         }
//     }

//     const toggleOpen = () => {
//         if (stories.length > 0) {
//             setIsOpen(!isOpen)
//         }
//     }

//     if (!mounted) return null
//     if (stories.length === 0) return null
//     if (!currentStory) return null

//     return (
//         <>
//             {/* Trigger in Navbar - Gold Border, No Glow */}
//             <div className="w-10 h-10 relative flex items-center justify-center z-50 group">
//                 <AnimatePresence>
//                     {!isOpen && (
//                         <motion.div
//                             layoutId="story-container"
//                             className="absolute inset-0 cursor-pointer rounded-full p-[2px]"
//                             onClick={toggleOpen}
//                             initial={{ opacity: 0, scale: 0.8 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.8 }}
//                             transition={{ duration: 0.2 }}
//                         >
//                             {/* Gold Border Ring */}
//                             <div className="absolute inset-0 rounded-full border-[2px] border-[#FFD700]/80 group-hover:border-[#FFD700] transition-colors shadow-[0_0_10px_rgba(255,215,0,0.2)]" />

//                             <div className="absolute inset-[3px] rounded-full bg-black flex items-center justify-center overflow-hidden">
//                                 <Image src={"https://res.cloudinary.com/dap0u41dz/image/upload/v1766771167/file_00000000d51472078b7e2f9d883a6674_majhmb.jpg"} alt="Abhishek Singh" fill className="object-cover" />
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>

//             {/* Portal for Expanded View */}
//             {createPortal(
//                 <AnimatePresence>
//                     {isOpen && (
//                         <div className="fixed inset-0 z-[100] flex items-center justify-center">
//                             {/* Backdrop */}
//                             <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 className="absolute inset-0 bg-black/80 backdrop-blur-md"
//                                 onClick={() => setIsOpen(false)}
//                             />

//                             {/* Card - Responsive Size */}
//                             <motion.div
//                                 layoutId="story-container"
//                                 className="relative w-[90vw] h-[65vh] md:w-[380px] md:h-[650px] bg-black rounded-[32px] overflow-hidden shadow-2xl z-10"
//                                 drag="y"
//                                 dragConstraints={{ top: 0, bottom: 0 }}
//                                 onDragEnd={(e, { offset, velocity }) => {
//                                     if (offset.y > 100 || velocity.y > 500) {
//                                         setIsOpen(false)
//                                     }
//                                 }}
//                             >
//                                 <div className="absolute inset-0 w-full h-full"
//                                     onMouseEnter={() => setIsPaused(true)}
//                                     onMouseLeave={() => setIsPaused(false)}
//                                     onMouseDown={() => setIsPaused(true)}
//                                     onMouseUp={(e) => {
//                                         setIsPaused(false)
//                                         handleTap(e)
//                                     }}
//                                     onTouchStart={() => setIsPaused(true)}
//                                     onTouchEnd={() => setIsPaused(false)}
//                                 >
//                                     {/* Loading State Spinner */}
//                                     {!isImageLoaded && (
//                                         <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
//                                             <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
//                                         </div>
//                                     )}

//                                     {/* Background Image */}
//                                     <AnimatePresence mode="wait">
//                                         <motion.div
//                                             key={currentStory.id}
//                                             initial={{ opacity: 0.6, scale: 1.05 }}
//                                             animate={{ opacity: 1, scale: 1 }}
//                                             exit={{ opacity: 0.6 }}
//                                             transition={{ duration: 0.3 }}
//                                             className="absolute inset-0 z-0"
//                                         >
//                                             <Image
//                                                 src={currentStory.mediaUrl}
//                                                 alt={currentStory.caption || "Story"}
//                                                 fill
//                                                 className="object-cover"
//                                                 priority
//                                                 onLoad={() => setIsImageLoaded(true)}
//                                             />
//                                             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
//                                         </motion.div>
//                                     </AnimatePresence>

//                                     {/* Content Overlay */}
//                                     <div className="absolute inset-0 z-10 flex flex-col p-5">
//                                         {/* Progress Bars */}
//                                         <div className="flex gap-1.5 mb-4">
//                                             {stories.map((story, idx) => (
//                                                 <div key={story.id} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
//                                                     <div
//                                                         ref={idx === currentIndex ? activeProgressBarRef : null}
//                                                         className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-100 ease-linear rounded-full"
//                                                         style={{
//                                                             width: idx < currentIndex ? "100%" : "0%"
//                                                         }}
//                                                     />
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         {/* Header */}
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center gap-2.5">
//                                                 <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden relative">
//                                                     <Image src={"https://res.cloudinary.com/dap0u41dz/image/upload/v1766771167/file_00000000d51472078b7e2f9d883a6674_majhmb.jpg"} alt="Abhishek Singh" fill className="object-cover" />
//                                                 </div>
//                                                 <div className="flex flex-col">
//                                                     <span className="text-white font-semibold text-xs leading-none">Abhishek Singh</span>
//                                                     <span className="text-white/60 text-[10px] leading-none mt-0.5">
//                                                         {currentStory.platform === 'linkedin' ? 'via LinkedIn' : 'via Instagram'}
//                                                     </span>
//                                                 </div>
//                                             </div>

//                                             {/* Toggle Close Button */}
//                                             <button
//                                                 onClick={(e) => {
//                                                     e.stopPropagation()
//                                                     setIsOpen(false)
//                                                 }}
//                                                 aria-label="Close Story"
//                                                 className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white/80 hover:bg-black/40 hover:text-white transition-colors"
//                                             >
//                                                 <X className="w-4 h-4" />
//                                             </button>
//                                         </div>

//                                         <div className="flex-1" />

//                                         {/* Footer */}
//                                         <div className="flex items-end justify-between gap-4 pb-1">
//                                             <p className="text-white/90 text-sm font-medium line-clamp-3 drop-shadow-md flex-1">
//                                                 {currentStory.caption}
//                                             </p>

//                                             <a
//                                                 href={currentStory.linkUrl}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 aria-label="Visit Story Link"
//                                                 className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all shadow-lg group/btn"
//                                                 onClick={(e) => e.stopPropagation()}
//                                             >
//                                                 <ArrowUpRight className="w-5 h-5 group-hover/btn:rotate-45 transition-transform duration-300" strokeWidth={2.5} />
//                                             </a>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         </div>
//                     )}
//                 </AnimatePresence>,
//                 document.body
//             )}
//         </>
//     )
// }
