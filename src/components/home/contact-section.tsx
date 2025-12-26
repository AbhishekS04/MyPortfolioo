"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ContactSection() {
    return (
        <section id="contact" className="py-32 md:py-48 relative">
            <div className="max-w-xl mx-auto text-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-medium text-white mb-6 leading-tight">
                        Let’s Build Something Together
                    </h2>
                    <p className="text-lg text-white/50 mb-10">
                        Open to collaborations, internships, and interesting ideas.
                    </p>

                    <Link href="/contact" className="inline-block group">
                        <div className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:scale-105 active:scale-95 transition-all duration-300">
                            <span>Contact Me</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
