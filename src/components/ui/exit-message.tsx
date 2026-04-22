"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ExitMessage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Check if cursor left from the top (Exit Intent)
      if (e.clientY <= 0) {
        setIsVisible(true);
      }
    };

    const handleMouseEnter = () => {
      // Hide if user comes back
      setIsVisible(false);
    };

    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter,
      );
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 w-full flex justify-center pb-6 pointer-events-none z-[10000]"
        >
          <div className="bg-black/50 backdrop-blur-md border border-white/5 rounded-full px-6 py-2 shadow-2xl">
            <p className="text-white/60 text-xs font-medium tracking-widest uppercase">
              Thanks for spending time here.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
