"use client";

import { useState, useEffect } from "react";

interface CopyCodeProps {
  code: string;
}

export function CopyCode({ code }: CopyCodeProps) {
  const [copied, setCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [progress, setProgress] = useState(0);
  const duration = 2000; // Reduced to 2s for email copy (4s is too long)

  useEffect(() => {
    if (copied) {
      // Delay showing confirmation to allow blur-out animation
      const showTimer = setTimeout(() => {
        setShowConfirmation(true);
      }, 400);

      setProgress(0);
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (elapsed >= duration) {
          clearInterval(interval);
          setShowConfirmation(false);
          setTimeout(() => {
            setCopied(false);
            setProgress(0);
          }, 400);
        }
      }, 16);

      return () => {
        clearInterval(interval);
        clearTimeout(showTimer);
      };
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
  };

  return (
    <div className="relative overflow-hidden flex items-center justify-between bg-[#111] border border-white/10 rounded-full px-8 py-3 w-fit min-w-[300px] h-16">
      {/* Progress background */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-white/10"
        style={{
          width: `${progress}%`,
          opacity: copied ? 1 : 0,
          transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Original content - code and button */}
      <div
        className="absolute inset-0 flex items-center justify-between px-8"
        style={{
          opacity: copied ? 0 : 1,
          filter: copied ? "blur(12px)" : "blur(0px)",
          transform: copied ? "scale(0.92)" : "scale(1)",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: copied ? "none" : "auto",
          zIndex: copied ? 0 : 20,
        }}
      >
        <span className="text-xl font-medium tracking-wide text-white/80 select-all truncate max-w-[200px]">
          {code}
        </span>
        <button
          onClick={handleCopy}
          className="ml-4 bg-white/10 hover:bg-white/20 text-white/90 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 active:scale-95 cursor-pointer select-none"
        >
          Copy
        </button>
      </div>

      {/* Confirmation content - Code Copied! */}
      <div
        className="absolute inset-0 flex items-center justify-center gap-3"
        style={{
          opacity: showConfirmation ? 1 : 0,
          filter: showConfirmation ? "blur(0px)" : "blur(12px)",
          transform: showConfirmation ? "scale(1)" : "scale(1.08)",
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3.5 h-3.5 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
              style={{
                strokeDasharray: 24,
                strokeDashoffset: showConfirmation ? 0 : 24,
                transition:
                  "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
              }}
            />
          </svg>
        </div>
        <span className="text-lg font-medium text-white">Email Copied!</span>
      </div>
    </div>
  );
}
