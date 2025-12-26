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
    const navigationCooldown = 400 // ms between navigations

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
        const threshold = 50
        if (info.offset.y < -threshold) {
            navigate(1)
        } else if (info.offset.y > threshold) {
            navigate(-1)
        }
    }

    const handleWheel = useCallback(
        (e: WheelEvent) => {
            if (Math.abs(e.deltaY) > 30) {
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

    const getCardStyle = (index: number) => {
        const total = displayImages.length
        let diff = index - currentIndex
        if (diff > total / 2) diff -= total
        if (diff < -total / 2) diff += total

        if (diff === 0) {
            return { y: 0, scale: 0.85, opacity: 1, zIndex: 5, rotateX: 0 }
        } else if (diff === -1) {
            return { y: -140, scale: 0.75, opacity: 0.6, zIndex: 4, rotateX: 10 }
        } else if (diff === -2) {
            return { y: -240, scale: 0.65, opacity: 0.3, zIndex: 3, rotateX: 20 }
        } else if (diff === 1) {
            return { y: 140, scale: 0.75, opacity: 0.6, zIndex: 4, rotateX: -10 }
        } else if (diff === 2) {
            return { y: 240, scale: 0.65, opacity: 0.3, zIndex: 3, rotateX: -20 }
        } else {
            return { y: diff > 0 ? 350 : -350, scale: 0.5, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -30 : 30 }
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
        <div ref={containerRef} className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#111111] rounded-[32px] border border-white/5 touch-none">
            {/* Subtle ambient glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-3xl" />
            </div>

            {/* Card Stack */}
            <div className="relative flex h-[400px] sm:h-[500px] w-full max-w-[320px] items-center justify-center" style={{ perspective: "1200px" }}>
                {displayImages.map((image, index) => {
                    if (!isVisible(index)) return null
                    const style = getCardStyle(index)
                    const isCurrent = index === currentIndex

                    return (
                        <motion.div
                            key={image.id}
                            className="absolute cursor-grab active:cursor-grabbing"
                            animate={{
                                y: style.y,
                                scale: style.scale,
                                opacity: style.opacity,
                                rotateX: style.rotateX,
                                zIndex: style.zIndex,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                mass: 1,
                            }}
                            drag={isCurrent ? "y" : false}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            style={{
                                transformStyle: "preserve-3d",
                                zIndex: style.zIndex,
                            }}
                        >
                            <div
                                className="relative h-[420px] w-[280px] overflow-hidden rounded-3xl bg-[#1a1a1a] ring-1 ring-white/10"
                                style={{
                                    boxShadow: isCurrent
                                        ? "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)"
                                        : "0 10px 30px -10px rgba(0,0,0,0.3)",
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
                                    priority={isCurrent}
                                />

                                {/* Bottom gradient overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Navigation dots */}
            <div className="absolute right-8 top-1/2 flex -translate-y-1/2 flex-col gap-2 z-20">
                {displayImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (index !== currentIndex) {
                                setCurrentIndex(index)
                            }
                        }}
                        className={`transition-all duration-300 rounded-full ${index === currentIndex ? "h-6 w-2 bg-white" : "h-2 w-2 bg-white/30 hover:bg-white/50"
                            }`}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
