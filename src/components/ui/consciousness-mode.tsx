'use client';

import { useEffect, useState, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';

export const ConsciousnessMode = () => {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(0);
  const isShiftPressedRef = useRef(false);
  const isActiveRef = useRef(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync isActiveRef
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // Track Shift Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') isShiftPressedRef.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        isShiftPressedRef.current = false;
        if (!isActiveRef.current) {
          progressRef.current = 0;
          setProgress(0);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Track Scroll — mounted once, reads refs to avoid stale closures
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isShiftPressedRef.current || isActiveRef.current) return;

      const speed = Math.abs(e.deltaY);

      if (speed > 0 && speed < 200) {
        // Reward VERY slow scrolls (intent)
        const increment = speed < 50 ? 5 : 2;
        progressRef.current = Math.min(100, progressRef.current + increment);
        setProgress(progressRef.current);

        if (progressRef.current >= 100) {
          isActiveRef.current = true;
          setIsActive(true);
        }
      }

      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        const decay = setInterval(() => {
          progressRef.current = Math.max(0, progressRef.current - 1);
          setProgress(progressRef.current);
          if (progressRef.current <= 0) clearInterval(decay);
        }, 80);
      }, 800);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => {
      setIsActive(false);
      isActiveRef.current = false;
      setProgress(0);
      progressRef.current = 0;
    }, 5000);
    return () => clearTimeout(timer);
  }, [isActive]);

  return (
    <>
      {/* Progress Bar — independent layer */}
      <AnimatePresence>
        {progress > 0 && !isActive && (
          <m.div
            key="bar"
            className="fixed bottom-0 left-0 h-[4px] z-[99997] bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            style={{ width: `${progress}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Blur overlay — independent layer, z-[99998] */}
      <AnimatePresence>
        {isActive && (
          <m.div
            key="blur"
            className="fixed inset-0 z-[99998] pointer-events-none"
            initial={{
              backdropFilter: 'blur(0px)',
              backgroundColor: 'rgba(0,0,0,0)',
            }}
            animate={{
              backdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
            exit={{
              backdropFilter: 'blur(0px)',
              backgroundColor: 'rgba(0,0,0,0)',
            }}
            transition={{ duration: 1.5, ease: 'circOut' }}
          />
        )}
      </AnimatePresence>

      {/* Text — independent layer, z-[99999] — always above everything */}
      <AnimatePresence>
        {isActive && (
          <m.div
            key="text"
            className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="text-center px-6">
              <m.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -10, opacity: 0, scale: 1.02 }}
                transition={{
                  duration: 1.2,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <h2 className="text-4xl md:text-6xl font-light tracking-[0.2em] text-white font-serif italic mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  You&apos;re paying attention.
                </h2>
                <m.p
                  className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, delay: 1.5 }}
                >
                  I like that.
                </m.p>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};
