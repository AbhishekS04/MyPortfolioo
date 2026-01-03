"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { LocationTag } from "@/components/ui/location-tag"
import { UserLocation } from "@/components/ui/user-location"

export function IdentityCard() {
    return (
        <div className="relative w-full h-full bg-[#111] rounded-[32px] overflow-hidden group border border-white/5">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://res.cloudinary.com/dap0u41dz/image/upload/v1766771167/file_00000000d51472078b7e2f9d883a6674_majhmb.jpg"
                    alt="Abhishek Singh"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-3xl font-bold text-white mb-2 leading-tight">Abhishek Singh</h2>
                    <p className="text-white/60 text-lg font-medium">
                        Product Engineer.
                    </p>

                    <div className="mt-6 flex items-center justify-between w-full gap-3 flex-wrap">
                        <LocationTag className="flex-1 min-w-[140px] !bg-white/10 !backdrop-blur-md !border-white/10" />
                        <UserLocation className="flex-1 min-w-[140px] !bg-white/10 !backdrop-blur-md !border-white/10" />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
