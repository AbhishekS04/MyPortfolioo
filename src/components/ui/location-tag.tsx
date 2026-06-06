"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";

interface LocationTagProps {
  className?: string;
}

export function LocationTag({ className = "" }: LocationTagProps) {
  const [isRetro, setIsRetro] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [terminalColor, setTerminalColor] = useState<"gray" | "green">("gray");
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize state from localStorage
  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      const storedRetro = localStorage.getItem("retro-mode") === "true";
      if (storedRetro) {
        setIsRetro(true);
        document.documentElement.classList.add("retro-mode");
      }
      setIsInitialized(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state with localStorage and DOM
  useEffect(() => {
    if (!isInitialized) return;

    if (isRetro) {
      document.documentElement.classList.add("retro-mode");
      localStorage.setItem("retro-mode", "true");
    } else {
      document.documentElement.classList.remove("retro-mode");
      localStorage.setItem("retro-mode", "false");
    }
  }, [isRetro, isInitialized]);

  // Manage terminal-active class for Navbar visibility
  useEffect(() => {
    if (showOverlay) {
      document.documentElement.classList.add("terminal-active");
    } else {
      document.documentElement.classList.remove("terminal-active");
    }
    return () => {
      document.documentElement.classList.remove("terminal-active");
    };
  }, [showOverlay]);

  const triggerRetroSequence = async () => {
    if (isRetro) {
      setIsRetro(false);
      return;
    }

    setShowOverlay(true);
    setTerminalLines([]);
    setTerminalColor("gray");

    if (typeof navigator !== "undefined" && navigator.vibrate)
      navigator.vibrate(50);

    const addLine = async (line: string, delay: number) => {
      setTerminalLines((prev) => [...prev, line]);
      if (typeof navigator !== "undefined" && navigator.vibrate)
        navigator.vibrate(10);
      await new Promise((r) => setTimeout(r, delay));
    };

    // DESTRUCTION PHASE (Gray)
    await new Promise((r) => setTimeout(r, 500));

    await addLine("> SYSTEM_ALERT: UNEXPECTED_INTERACTION", 400);
    await addLine('> ROOT_QUERY: "Why did you touch that?"', 800);
    await addLine('> WARNING: "Restricted Access Protocol"', 600);
    await addLine("> ROOT_ACCESS_GRANTED", 400);
    await addLine("> EXECUTING: sudo rm -rf /portfolio_v2", 800);
    await addLine("> PURGING_ASSETS_DIRECTORY...", 400);
    await addLine("> UNLINKING_STYLESHEETS...", 400);
    await addLine("> CLEARING_RUNTIME_CACHE...", 600);

    if (typeof navigator !== "undefined" && navigator.vibrate)
      navigator.vibrate([50, 50, 100]);
    await addLine("> PROCESS_COMPLETE: CURRENT_VIEW_TERMINATED", 1200);

    // REBIRTH PHASE (Green)
    setTerminalColor("green");
    await addLine("> INITIALIZING_LEGACY_PROTOCOL...", 800);
    await addLine("> LOADING_BACKUP_ARCHIVES...", 500);
    await addLine("> CHECKING_VRAM... [OK]", 400);
    await addLine("> LAUNCHING_LEGACY_INTERFACE...", 1500);

    // Activate Retro Mode
    // Activate Retro Mode
    setIsRetro(true);

    setShowOverlay(false);
  };

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      triggerRetroSequence();
    }, 800);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <>
      {/* Terminal Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-[100000] bg-black p-6 md:p-20 font-mono overflow-hidden cursor-wait flex flex-col justify-start items-start transition-colors duration-500 ${terminalColor === "green" ? "text-[#33ff00] drop-shadow-[0_0_8px_rgba(51,255,0,0.4)]" : "text-gray-300"}`}
          >
            <div className="w-full max-w-4xl space-y-1 text-xs md:text-lg uppercase">
              {terminalLines.map((line, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="break-all md:break-words whitespace-pre-wrap"
                >
                  {line}
                </m.div>
              ))}

              {/* Blinking Cursor */}
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2"
              >
                <span
                  className={
                    terminalColor === "green"
                      ? "text-[#33ff00]"
                      : "text-gray-500"
                  }
                >
                  {">"}
                </span>
                <m.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className={`inline-block w-2 h-4 md:w-3 md:h-5 ml-2 align-middle ${terminalColor === "green" ? "bg-[#33ff00]" : "bg-gray-300"}`}
                />
              </m.div>
            </div>

            {/* Scanline Effect */}
            <div
              className="absolute inset-0 pointer-events-none select-none opacity-10"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, #ffffff 4px)",
              }}
            ></div>
          </m.div>
        )}
      </AnimatePresence>

      <button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: "none" }}
        className={`group relative flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition-all duration-300 hover:border-white/20 hover:bg-white/10 select-none touch-none ${className}`}
      >
        <div className="relative flex items-center justify-center">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isRetro ? "bg-amber-500" : "bg-emerald-500"}`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${isRetro ? "bg-amber-500" : "bg-emerald-500"}`}
          />
        </div>

        <div className="relative overflow-hidden h-5 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <m.div
              key={isRetro ? "retro" : "standard"}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-sm font-medium block whitespace-nowrap ${isRetro ? "font-mono text-amber-500" : "font-sans text-white/90"}`}
            >
              {isRetro ? "SYSTEM OVERRIDE" : "Available for hire"}
            </m.div>
          </AnimatePresence>
        </div>
      </button>
    </>
  );
}
