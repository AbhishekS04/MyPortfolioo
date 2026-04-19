"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Signature } from "@/components/ui/signature";

export function ContactSection() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Subtle Signature */}
      <Signature />

      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6">
          Let&apos;s build something{" "}
          <span className="text-white/40">extraordinary.</span>
        </h2>

        <p className="text-white/60 text-lg md:text-xl mb-10 max-w-lg">
          Currently available for select projects. Let&apos;s discuss your
          vision.
        </p>

        <Link
          href="mailto:abhishek23main@gmail.com"
          className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium transition-all active:scale-95"
        >
          <Mail className="w-5 h-5" />
          <span>Start a Project</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
