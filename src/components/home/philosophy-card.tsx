"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function PhilosophyCard() {
  return (
    <motion.a
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-full block relative group"
      initial="initial"
      whileHover="hover"
      animate="initial"
    >
      <motion.div
        className="w-full h-full bg-[#1c1c1c] rounded-[32px] p-10 flex flex-col justify-between overflow-hidden border border-white/5 relative z-10"
        variants={{
          initial: {
            y: 0,
            backgroundColor: "rgba(28, 28, 28, 1)",
            borderColor: "rgba(255, 255, 255, 0.05)",
            scale: 1,
          },
          hover: {
            y: -4,
            backgroundColor: "rgba(32, 32, 32, 1)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            scale: 1.01, // Subtle scale up
            transition: {
              duration: 0.4,
              ease: [0.25, 1, 0.5, 1],
            },
          },
        }}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between relative z-20">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 transition-colors duration-300">
            Curriculum Vitae
          </span>

          <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
            <motion.div
              variants={{
                initial: { x: 0, y: 0, opacity: 1 },
                hover: { x: 20, y: -20, opacity: 0 },
              }}
              transition={{ duration: 0.4, ease: "circIn" }}
              className="absolute"
            >
              <ArrowUpRight className="w-5 h-5 text-white/40" />
            </motion.div>
            <motion.div
              variants={{
                initial: { x: -20, y: 20, opacity: 0 },
                hover: { x: 0, y: 0, opacity: 1 },
              }}
              transition={{ duration: 0.4, ease: "circOut", delay: 0.1 }}
              className="absolute"
            >
              <ArrowUpRight className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-auto space-y-4 relative z-20">
          <motion.h2
            className="text-5xl font-serif font-medium text-white/90 tracking-tight leading-none"
            variants={{
              initial: { x: 0 },
              hover: { x: 4 }, // Subtle nudge
            }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            Resume
          </motion.h2>
          <p className="text-sm text-white/40 leading-relaxed font-light max-w-[90%] group-hover:text-white/60 transition-colors duration-300">
            Selected works, experience, and capabilities.
          </p>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 z-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent -translate-x-[100%]"
          variants={{
            initial: { x: "-100%" },
            hover: {
              x: "100%",
              transition: {
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1,
              },
            },
          }}
        />
      </motion.div>
    </motion.a>
  );
}
