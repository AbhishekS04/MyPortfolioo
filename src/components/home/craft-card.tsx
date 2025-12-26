"use client"

import Image from "next/image"

export function CraftCard() {
    return (
        <div className="relative w-full h-full min-h-[180px] rounded-[32px] overflow-hidden group border border-white/5">
            <Image
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                alt="Craft Detail"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />

            <div className="absolute bottom-6 left-6 z-10">
                <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white shadow-lg">
                    Visual Craft
                </div>
            </div>
        </div>
    )
}
