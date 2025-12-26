"use client"

import { motion } from "framer-motion"

export function PhilosophyCard() {
    return (
        <div className="w-full h-full min-h-[180px] bg-white text-black rounded-[32px] p-8 flex flex-col justify-between group relative overflow-hidden">
            <div className="z-10">
                <h3 className="text-4xl font-bold tracking-tighter mb-2">Aa</h3>
                <div className="flex gap-2 mt-4">
                    <div className="w-8 h-8 rounded-full bg-[#FF4D00]" />
                    <div className="w-8 h-8 rounded-full bg-[#FFB800]" />
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A]" />
                    <div className="w-8 h-8 rounded-full bg-[#808080]" />
                </div>
            </div>
            <div className="z-10">
                <p className="text-[10px] uppercase tracking-widest font-mono opacity-60">Design System</p>
                <p className="text-sm font-medium leading-tight mt-1">
                    Typography & <br /> Color Theory
                </p>
            </div>

            {/* Subtle Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>
    )
}
