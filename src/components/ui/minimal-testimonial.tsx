"use client";

import { useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "Working with them transformed our entire brand identity. The attention to detail was exceptional.",
    name: "Sarah Chen",
    role: "CEO at Stripe",
    image:
      "https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D$0",
  },
  {
    quote:
      "A rare talent who combines strategic thinking with flawless execution. Highly recommended.",
    name: "Marcus Johnson",
    role: "Design Lead at Linear",
    image:
      "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D$0",
  },
  {
    quote:
      "The most seamless collaboration I've experienced. They truly understand modern design.",
    name: "Elena Voss",
    role: "Founder at Notion",
    image:
      "https://plus.unsplash.com/premium_photo-1689977830819-d00b3a9b7363?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D$0",
  },
];

export function TestimonialsMinimal() {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 md:py-32">
      {/* Section Header */}
      <div className="mb-16 md:mb-20 text-center">
        <h2 className="text-sm font-medium text-blue-400 tracking-wider uppercase mb-3">
          Testimonials
        </h2>
        <h3 className="text-3xl md:text-4xl font-semibold text-white">
          What Clients Say
        </h3>
      </div>

      {/* Quote using CSS Grid for auto-height stacking */}
      <div className="relative mb-12 grid grid-cols-1 min-h-[120px]">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`
              col-start-1 row-start-1
              text-2xl md:text-4xl font-light leading-snug text-white/90
              transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${
                active === i
                  ? "opacity-100 translate-y-0 scale-100 blur-0 z-10"
                  : "opacity-0 translate-y-8 scale-95 blur-sm z-0 pointer-events-none"
              }
            `}
          >
            &quot;{t.quote}&quot;
          </div>
        ))}
      </div>

      {/* Author Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 pt-6 border-t border-white/10">
        {/* Avatars */}
        <div className="flex -space-x-3">
          {testimonials.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`
                relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-4 ring-[#0a0a0a]
                transition-all duration-500 ease-out
                ${active === i ? "z-10 scale-110 grayscale-0" : "grayscale opacity-50 hover:opacity-100 hover:scale-105 hover:grayscale-0"}
              `}
            >
              <Image
                src={t.image || "/placeholder.svg"}
                alt={t.name}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Active Author Info */}
        <div className="flex-1 grid grid-cols-1">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`
                col-start-1 row-start-1
                flex flex-col justify-center
                transition-all duration-500 ease-out
                ${active === i ? "opacity-100 translate-x-0 z-10" : "opacity-0 -translate-x-4 pointer-events-none z-0"}
              `}
            >
              <span className="text-lg font-medium text-white">{t.name}</span>
              <span className="text-sm text-white/50">{t.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
