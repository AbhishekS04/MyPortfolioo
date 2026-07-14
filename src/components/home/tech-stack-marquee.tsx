'use client';

import { m } from 'framer-motion';

const TECH_STACK = [
  'C++',
  'Java',
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Bootstrap',
];

export function TechStackMarquee() {
  return (
    <div className="w-full bg-[#111111] border border-white/5 rounded-[24px] overflow-hidden py-6 relative flex items-center">
      {/* Label */}
      <div className="absolute left-8 z-10 bg-[#111111] pr-6 hidden md:block">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500/80 animate-pulse" />
          <span className="text-sm font-medium text-white/60 uppercase tracking-widest">
            Technologies
          </span>
        </div>
      </div>

      {/* Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#111111] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#111111] to-transparent z-10 pointer-events-none" />

      {/* Marquee Container */}
      <div className="flex overflow-hidden select-none mask-image:linear-gradient(to right, transparent, black 10%, black 90%, transparent)">
        <m.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="flex gap-12 flex-shrink-0 items-center pr-12 pl-12 md:pl-48" // Added padding-left for label on desktop
        >
          {[...TECH_STACK, ...TECH_STACK].map((tech, index) => (
            <span
              key={`${tech}-${index}`}
              className="text-xl md:text-2xl font-medium text-white/70 whitespace-nowrap hover:text-white transition-colors cursor-default"
            >
              {tech}
            </span>
          ))}
        </m.div>
      </div>
    </div>
  );
}
