"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Doto } from "next/font/google";

const doto = Doto({ subsets: ["latin"] });

interface Error404Props {
  postcardImage?: string;
  postcardAlt?: string;
  curvedTextTop?: string;
  curvedTextBottom?: string;
  heading?: string;
  subtext?: string;
  backButtonLabel?: string;
  backButtonHref?: string;
}

export function Error404({
  postcardImage = "https://cloud-snapp.vercel.app/api/cdn/df3cf166-3366-45c3-907f-218183b63d3e.jpg?fmt=avif",
  postcardAlt = "New York City Postcard",
  curvedTextTop = "The General Intelligence",
  curvedTextBottom = "Company of New York",
  heading = "(404) Looks like the page you're looking for got lost somewhere.",
  subtext = "But hey — in New York, even the unexpected detours lead somewhere.",
  backButtonLabel = "Back to Home",
  backButtonHref = "/",
}: Error404Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#0a0a0a]">
      <div className="flex flex-col items-center">
        <div className="relative mb-16">
          <svg
            className="absolute -top-16 -left-12 w-[140px] h-[140px] pointer-events-none z-20 animate-spin-slow"
            viewBox="0 0 140 140"
          >
            <defs>
              <path
                id="circlePath"
                d="M 70,70 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
                fill="transparent"
              />
            </defs>
            <text
              className="text-[11px] fill-white/60 font-serif uppercase"
              style={{ fontWeight: 400, letterSpacing: "0.15em" }}
            >
              <textPath href="#circlePath" startOffset="0%">
                {curvedTextTop} • {curvedTextBottom} •
              </textPath>
            </text>
          </svg>

          <div className="relative z-10">
            <div className="relative p-3 shadow-2xl rotate-[4deg] hover:rotate-0 transition-transform duration-300 bg-[#1a1a1a] border border-white/10">
              <div className="relative overflow-hidden bg-black">
                <img
                  src={postcardImage}
                  alt={postcardAlt}
                  className="w-[360px] h-[220px] object-cover opacity-80"
                />
                {/* Overlay to make it feel more "postcard-y" */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              </div>
            </div>

            {/* Postal cancellation marks */}
            <svg
              className="absolute -right-16 top-1/2 -translate-y-1/2 w-28 h-20 opacity-30 invert"
              viewBox="0 0 100 60"
            >
              <path
                d="M 10 15 Q 20 10 30 15 Q 40 20 50 15 Q 60 10 70 15 Q 80 20 90 15"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M 10 25 Q 20 20 30 25 Q 40 30 50 25 Q 60 20 70 25 Q 80 30 90 25"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M 10 35 Q 20 30 30 35 Q 40 40 50 35 Q 60 30 70 35 Q 80 40 90 35"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        </div>

        <div className="text-center max-w-2xl">
          <h1
            className={`text-4xl md:text-5xl mb-6 text-white text-balance leading-tight ${doto.className}`}
          >
            {heading}
          </h1>
          <p className="text-white/60 text-base md:text-lg mb-10 font-sans">
            {subtext}
          </p>
          <Button
            asChild
            className="rounded-full px-8 py-6 bg-white text-black hover:bg-white/90"
          >
            <Link href={backButtonHref} className="flex items-center gap-2">
              {backButtonLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
