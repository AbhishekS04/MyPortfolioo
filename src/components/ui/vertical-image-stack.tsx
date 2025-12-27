"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, PanInfo } from "framer-motion"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

interface GalleryItem {
    id: number;
    src: string;
    alt: string;
}

export function VerticalImageStack() {
    const [images, setImages] = useState<GalleryItem[]>([]);

    // Fallback static images to prevent empty state initially
    const FALLBACK_IMAGES = [
        {
            id: 1,
            src: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop",
            alt: "Black sneaker with red sole",
        },
        {
            id: 2,
            src: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1000&auto=format&fit=crop",
            alt: "White minimalist sneaker",
        },
    ];

    useEffect(() => {
        const fetchGallery = async () => {
            const { data } = await supabase
                .from("gallery_images")
                .select("*")
                .order("display_order", { ascending: true });

            if (data && data.length > 0) {
                setImages(data.map((item, i) => ({
                    id: i + 1,
                    src: item.image_url,
                    alt: item.alt_text || "Gallery Image"
                })));
            } else {
                setImages(FALLBACK_IMAGES);
            }
        };
        fetchGallery();
    }, []);

    // Ensure we always have an array
    const displayImages = images.length > 0 ? images : FALLBACK_IMAGES;

    const [currentIndex, setCurrentIndex] = useState(0)
    const lastNavigationTime = useRef(0)
    const navigationCooldown = 400 // Adjusted cooldown

    const navigate = useCallback((newDirection: number) => {
        const now = Date.now()
        if (now - lastNavigationTime.current < navigationCooldown) return
        lastNavigationTime.current = now

        setCurrentIndex((prev) => {
            if (newDirection > 0) {
                return prev === displayImages.length - 1 ? 0 : prev + 1
            }
            return prev === 0 ? displayImages.length - 1 : prev - 1
        })
    }, [displayImages.length])

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 60 // Significant pull required
        const velocityThreshold = 100 // High velocity sweep

        // Swipe triggers on distance OR high velocity
        if (info.offset.y < -threshold || info.velocity.y < -velocityThreshold) {
            navigate(1)
        } else if (info.offset.y > threshold || info.velocity.y > velocityThreshold) {
            navigate(-1)
        }
    }

    const handleWheel = useCallback(
        (e: WheelEvent) => {
            e.stopPropagation();
            // Debounce wheel slightly less or differently? 
            // Actually just relying on cooldown is enough.
            if (Math.abs(e.deltaY) > 40) { // Higher threshold for stability
                if (e.deltaY > 0) {
                    navigate(1)
                } else {
                    navigate(-1)
                }
            }
        },
        [navigate],
    )

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const onWheel = (e: WheelEvent) => {
            e.preventDefault() // prevent page scroll
            handleWheel(e)
        }

        container.addEventListener("wheel", onWheel, { passive: false })
        return () => container.removeEventListener("wheel", onWheel)
    }, [handleWheel])

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const getCardStyle = (index: number) => {
        const total = displayImages.length
        let diff = index - currentIndex
        if (diff > total / 2) diff -= total
        if (diff < -total / 2) diff += total

        // Responsive offsets
        const yBase = isMobile ? 85 : 140
        const ySecond = isMobile ? 150 : 240
        const yHidden = isMobile ? 220 : 350

        if (diff === 0) {
            return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0, filter: "brightness(1)" }
        } else if (diff === -1) {
            return { y: -yBase, scale: 0.85, opacity: 0.4, zIndex: 4, rotateX: 5, filter: "brightness(0.5)" }
        } else if (diff === -2) {
            return { y: -ySecond, scale: 0.75, opacity: 0.2, zIndex: 3, rotateX: 10, filter: "brightness(0.3)" }
        } else if (diff === 1) {
            return { y: yBase, scale: 0.85, opacity: 0.4, zIndex: 4, rotateX: -5, filter: "brightness(0.5)" }
        } else if (diff === 2) {
            return { y: ySecond, scale: 0.75, opacity: 0.2, zIndex: 3, rotateX: -10, filter: "brightness(0.3)" }
        } else {
            return { y: diff > 0 ? yHidden : -yHidden, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -20 : 20, filter: "brightness(0)" }
        }
    }

    const isVisible = (index: number) => {
        const total = displayImages.length
        let diff = index - currentIndex
        if (diff > total / 2) diff -= total
        if (diff < -total / 2) diff += total
        return Math.abs(diff) <= 2
    }

    return (
        <div ref={containerRef} className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#111111] rounded-[32px] border border-white/5 select-none pointer-events-none sm:pointer-events-auto sm:touch-none">
            {/* Subtle ambient glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-3xl opacity-50" />
            </div>

            {/* Card Stack */}
            <div className="relative flex h-[320px] sm:h-[500px] w-full max-w-[320px] items-center justify-center py-10" style={{ perspective: "1000px" }}>
                {displayImages.map((image, index) => {
                    if (!isVisible(index)) return null
                    const style = getCardStyle(index)
                    const isCurrent = index === currentIndex

                    // Priority load current, previous, and next images for smoothness
                    const shouldPrioritize = Math.abs(index - currentIndex) <= 1 || (currentIndex === 0 && index === displayImages.length - 1) || (currentIndex === displayImages.length - 1 && index === 0);

                    return (
                        <motion.div
                            key={image.id}
                            className="absolute cursor-grab active:cursor-grabbing w-full flex justify-center pointer-events-auto"
                            animate={{
                                y: style.y,
                                scale: style.scale,
                                opacity: style.opacity,
                                rotateX: style.rotateX,
                                zIndex: style.zIndex,
                                filter: style.filter
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 120,    // Slower, smoother settle
                                damping: 20,       // Less bouncy, more controlled
                                mass: 1.2,         // "Heavier" feel
                            }}
                            drag={isCurrent ? "y" : false}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={0.25} // Resistance for "pulling weight" feel
                            onDragEnd={handleDragEnd}
                            style={{
                                transformStyle: "preserve-3d",
                                zIndex: style.zIndex,
                                willChange: "transform, opacity, filter"
                            }}
                        >
                            <div
                                className="relative h-[260px] w-[180px] sm:h-[420px] sm:w-[280px] overflow-hidden rounded-3xl bg-[#1a1a1a] ring-1 ring-white/10"
                                style={{
                                    boxShadow: isCurrent
                                        ? "0 30px 60px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)"
                                        : "0 10px 20px -10px rgba(0,0,0,0.5)",
                                }}
                            >
                                {/* Card inner glow */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 via-transparent to-transparent z-10 pointer-events-none" />

                                <Image
                                    src={image.src || "/placeholder.svg"}
                                    alt={image.alt}
                                    fill
                                    className="object-cover w-full h-full"
                                    draggable={false}
                                    priority={shouldPrioritize}
                                    sizes="300px"
                                    quality={90}
                                />

                                {/* Bottom gradient overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Navigation dots - Optimized */}
            <div className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-2 z-20">
                {displayImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            // Allow instant jump
                            setCurrentIndex(index)
                        }}
                        className={`transition-all duration-300 rounded-full ${index === currentIndex ? "h-8 w-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "h-1.5 w-1.5 bg-white/20 hover:bg-white/50"
                            }`}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
