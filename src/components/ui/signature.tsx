"use client";

import { cn } from "@/lib/utils";
import { sacramento } from "@/lib/fonts"; // Assuming a cursive font is available in fonts.ts

export function Signature() {
    return (
        <div className="absolute right-4 bottom-4 md:right-10 md:bottom-10 opacity-30 pointer-events-none select-none mix-blend-overlay">
            <span className={cn(sacramento.className, "text-4xl md:text-5xl text-white/80")}>
                Abhishek Singh 
            </span>
        </div>
    );
}
