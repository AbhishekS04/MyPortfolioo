"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function IdentityCard() {
    return (
        <div className="relative w-full h-full bg-[#111] rounded-[32px] overflow-hidden group border border-white/5">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://res.cloudinary.com/dap0u41dz/image/upload/v1766771167/file_00000000d51472078b7e2f9d883a6674_majhmb.jpg"
                    alt="Abhishek Singh"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-white mb-2 leading-tight">Abhishek Singh</h2>
                    <p className="text-white/60 text-lg font-medium">
                        Frontend Engineer & <br /> Ui System Designer.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                        <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-white/80">
                            Available for hire
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-white/80">
                            Remote
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
