"use client";

import { m, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface TransitionOverlayProps {
  isSwitching: boolean;
  targetMode: "Minimal" | "Detailed";
}

export function TransitionOverlay({
  isSwitching,
  targetMode,
}: TransitionOverlayProps) {
  return (
    <AnimatePresence>
      {isSwitching && (
        <m.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center pointer-events-none"
          style={{ backdropFilter: "blur(10px)" }} // Fallback
        >
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/80 font-mono text-sm tracking-widest uppercase text-center px-4">
              {targetMode === "Minimal"
                ? "Building this portfolio minimal for you..."
                : "Making a detailed portfolio for you..."}
            </p>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
