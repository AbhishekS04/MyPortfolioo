"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

interface ImageZoomOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    altText?: string;
}

export function ImageZoomOverlay({ isOpen, onClose, imageUrl, altText }: ImageZoomOverlayProps) {
    const [mounted, setMounted] = useState(false);
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Motion values for panning
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset zoom and pan when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setScale(1);
            x.set(0);
            y.set(0);
        }
    }, [isOpen, x, y]);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
        }
    }, [isOpen]);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) { // OS-level pinch gesture often maps to ctrl+wheel
            e.preventDefault();
            const delta = -e.deltaY * 0.01;
            setScale(prev => Math.min(Math.max(1, prev + delta), 5));
        }
    }, []);

    const reset = () => {
        setScale(1);
        x.set(0);
        y.set(0);
    };

    if (!mounted) return null;

    const content = (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden touch-none"
                    onWheel={handleWheel}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-zoom-out"
                    />

                    {/* Controls HUD */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[10] flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
                    >
                        <button
                            onClick={() => setScale(s => Math.max(1, s - 0.5))}
                            className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-5 h-5" />
                        </button>

                        <div className="w-px h-4 bg-white/10 mx-2" />

                        <span className="text-xs font-mono text-white/40 min-w-[3rem] text-center">
                            {Math.round(scale * 100)}%
                        </span>

                        <div className="w-px h-4 bg-white/10 mx-2" />

                        <button
                            onClick={() => setScale(s => Math.min(5, s + 0.5))}
                            className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>

                        <button
                            onClick={reset}
                            className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all ml-2"
                            title="Reset"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </motion.div>

                    {/* Close Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={onClose}
                        className="absolute top-8 right-8 z-[10] p-4 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-all border border-white/10"
                    >
                        <X className="w-6 h-6" />
                    </motion.button>

                    {/* Hint text */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/20 font-black"
                    >
                        Pinch_or_Scroll_to_Explore
                    </motion.p>

                    {/* Image Container */}
                    <motion.div
                        ref={containerRef}
                        className="relative w-full h-full flex items-center justify-center p-4 md:p-20"
                        style={{ perspective: 1000 }}
                    >
                        <motion.img
                            src={imageUrl}
                            alt={altText || "Zoomed project image"}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{
                                opacity: 1,
                                scale: scale,
                                x: x.get(),
                                y: y.get(),
                                rotateX: 0,
                                transition: {
                                    opacity: { duration: 0.4 },
                                    scale: { type: "spring", stiffness: 300, damping: 30 },
                                    y: { type: "spring", stiffness: 300, damping: 30 }
                                }
                            }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            drag={scale > 1}
                            dragConstraints={containerRef}
                            onDrag={(e, info) => {
                                x.set(x.get() + info.delta.x);
                                y.set(y.get() + info.delta.y);
                            }}
                            className={`max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-lg md:rounded-2xl transition-shadow duration-500 ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                            draggable={false}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(content, document.body);
}
