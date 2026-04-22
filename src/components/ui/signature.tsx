"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { sacramento } from "@/lib/fonts";

export function Signature() {
  const clickCountRef = useRef(0);
  const [isTriggered, setIsTriggered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const lastClickTime = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  // Local asset — bypasses ImageKit bandwidth limits
  const VIDEO_SRC = "/ass/signature.mp4";

  const handleClick = () => {
    const now = Date.now();
    const diff = now - lastClickTime.current;

    if (diff < 500) {
      // Rapid click window
      clickCountRef.current += 1;
      if (clickCountRef.current >= 3) {
        setVideoFailed(false);
        setIsTriggered(true);
        setIsMuted(false);
        if (videoRef.current) {
          const vid = videoRef.current;
          vid.currentTime = 0;
          const playPromise = vid.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              vid.muted = true;
              setIsMuted(true);
              vid.play().catch(() => {});
            });
          }
        }
        clickCountRef.current = 0;
      }
    } else {
      clickCountRef.current = 1;
    }

    lastClickTime.current = now;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1000);
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isTriggered) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isTriggered]);

  // Buttery smooth GSAP-level extreme easing
  const wipeTransition = {
    duration: 1.4,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="absolute right-4 bottom-4 md:right-10 md:bottom-10 opacity-30 select-none transition-opacity z-50 mix-blend-overlay cursor-default"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {/* Signature */}
        <span
          className={cn(
            sacramento.className,
            "text-4xl md:text-5xl text-white/80",
          )}
        >
          Abhishek Singh
        </span>
      </div>

      {mounted &&
        createPortal(
          <>
            <AnimatePresence mode="wait">
              {isTriggered && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center pointer-events-auto">
                  {/* Global Fade Backdrop for richness */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      transition: { delay: 1.2, duration: 1.5 },
                    }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md"
                  />

                  {/* 4 Corners Wipe Panels */}
                  <motion.div
                    initial={{ x: "-100%", y: "-100%" }}
                    animate={{ x: "0%", y: "0%" }}
                    exit={{
                      x: "-100%",
                      y: "-100%",
                      transition: {
                        delay: 0.8,
                        duration: 1.4,
                        ease: [0.76, 0, 0.24, 1],
                      },
                    }}
                    transition={wipeTransition}
                    className="fixed top-0 left-0 w-1/2 h-1/2 bg-black origin-top-left z-20"
                  />
                  <motion.div
                    initial={{ x: "100%", y: "-100%" }}
                    animate={{ x: "0%", y: "0%" }}
                    exit={{
                      x: "100%",
                      y: "-100%",
                      transition: {
                        delay: 0.8,
                        duration: 1.4,
                        ease: [0.76, 0, 0.24, 1],
                      },
                    }}
                    transition={wipeTransition}
                    className="fixed top-0 right-0 w-1/2 h-1/2 bg-black origin-top-right z-20"
                  />
                  <motion.div
                    initial={{ x: "-100%", y: "100%" }}
                    animate={{ x: "0%", y: "0%" }}
                    exit={{
                      x: "-100%",
                      y: "100%",
                      transition: {
                        delay: 0.8,
                        duration: 1.4,
                        ease: [0.76, 0, 0.24, 1],
                      },
                    }}
                    transition={wipeTransition}
                    className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-black origin-bottom-left z-20"
                  />
                  <motion.div
                    initial={{ x: "100%", y: "100%" }}
                    animate={{ x: "0%", y: "0%" }}
                    exit={{
                      x: "100%",
                      y: "100%",
                      transition: {
                        delay: 0.8,
                        duration: 1.4,
                        ease: [0.76, 0, 0.24, 1],
                      },
                    }}
                    transition={wipeTransition}
                    className="fixed bottom-0 right-0 w-1/2 h-1/2 bg-black origin-bottom-right z-20"
                  />

                  {/* Restricted Zone Status HUD - Top Positioned */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, transition: { delay: 0.1 } }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-1 sm:space-y-2 w-full px-4 text-center"
                  >
                    <span className="text-red-500/60 text-[8px] sm:text-[10px] font-mono tracking-[0.3em] sm:tracking-[0.8em] uppercase whitespace-nowrap animate-pulse">
                      Restricted Zone Accessed
                    </span>
                    <span className="text-white/30 text-[7px] sm:text-[9px] font-mono tracking-[0.2em] sm:tracking-[0.4em] uppercase whitespace-nowrap">
                      Easter Egg Unlocked • Enjoy the Secret
                    </span>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Dynamic Video Content Kept in DOM continually for iOS auto-play synchronization */}
            <div
              className={`fixed inset-0 z-[100001] flex items-center justify-center transition-all duration-[1200ms] pointer-events-none ${isTriggered ? "opacity-100 blur-none scale-100" : "opacity-0 blur-[10px] scale-90"}`}
              style={{
                transitionDelay: isTriggered ? "900ms" : "0ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div
                className={`relative flex items-center justify-center w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] max-w-5xl aspect-video p-2 sm:p-4 ${isTriggered ? "pointer-events-auto" : "pointer-events-none"}`}
              >
                <div className="relative w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] bg-black/40 ring-1 ring-white/10 group flex items-center justify-center">
                  {videoFailed ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-3 sm:space-y-4 bg-black/80 backdrop-blur-sm rounded-[24px] sm:rounded-[32px]">
                      <svg
                        className="w-10 h-10 sm:w-12 sm:h-12 text-red-500/70 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <p className="text-red-400 text-xs sm:text-sm md:text-base font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                        Connection Failed
                      </p>
                      <p className="text-white/40 text-[10px] sm:text-xs md:text-sm max-w-sm sm:max-w-md font-mono mt-2">
                        The media source is offline. If using Supabase, check if
                        the project is paused or the bucket is private.
                      </p>
                    </div>
                  ) : VIDEO_SRC ? (
                    <video
                      ref={videoRef}
                      playsInline
                      preload="metadata"
                      muted={isMuted}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      className="w-full h-full object-cover cursor-pointer"
                      onEnded={() => setIsTriggered(false)}
                      onError={() => setVideoFailed(true)}
                      src={VIDEO_SRC}
                    />
                  ) : (
                    <div className="w-[300px] h-[300px] flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full border-2 border-white/5 border-t-white/40 animate-spin" />
                      <p className="text-white/20 text-xs font-mono uppercase tracking-widest">
                        Awaiting Secret...
                      </p>
                    </div>
                  )}

                  {/* Dynamic Terminate Action */}
                  <button
                    onClick={() => setIsTriggered(false)}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-0 group-hover:opacity-100 transition-all duration-700 text-white/40 hover:text-red-500 text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] border border-white/10 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full backdrop-blur-2xl bg-black/40 hover:bg-black/90 shadow-2xl translate-y-1 group-hover:translate-y-0 font-mono z-50"
                  >
                    [ ABORT_SEQUENCE ]
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
