"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
    Gamepad2,
    Film,
    Plane,
    Mail,
    Phone,
    MapPin,
    User,
    Download,
    ExternalLink,
    Instagram,
    Youtube,
    Github,
    Twitter
} from "lucide-react"

// --- Components ---

const BentoCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`bg-[#111] border border-white/5 rounded-[32px] overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
)

const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
        {children}
    </span>
)

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12 selection:bg-white/20">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Navigation / Back Button */}
                <div className="flex justify-between items-center mb-12">
                    <Link href="/" className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                        <div className="p-2 rounded-full border border-white/5 group-hover:border-white/20 transition-all">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </div>
                        <span className="text-sm font-medium">Back Home</span>
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold flex items-center gap-2 hover:bg-white/90 transition-all"
                    >
                        <Download size={16} />
                        Download CV
                    </motion.button>
                </div>

                {/* --- Top Row: Profile & Bio --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <BentoCard className="md:col-span-4 h-[320px] relative">
                        <Image
                            src="https://res.cloudinary.com/dap0u41dz/image/upload/v1766771167/file_00000000d51472078b7e2f9d883a6674_majhmb.jpg"
                            alt="Abhishek Singh"
                            fill
                            className="object-cover opacity-80"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <h1 className="text-2xl font-bold">Abhishek Singh</h1>
                            <p className="text-white/40 text-sm italic">UI System Designer & Developer</p>
                        </div>
                    </BentoCard>

                    <BentoCard className="md:col-span-8 p-8 flex flex-col justify-center">
                        <p className="text-xl md:text-2xl font-medium leading-relaxed text-white/90">
                            My name is <span className="text-white">Abhishek Singh</span>, a self-taught <span className="text-white">UI Designer & Frontend Engineer</span> with 4+ years of experience creating modern, clean, and minimal digital experiences that make a lasting impression.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Badge>Founder</Badge>
                            <Badge>Product Designer</Badge>
                            <Badge>Systems Thinker</Badge>
                        </div>
                    </BentoCard>
                </div>

                {/* --- Interests Row --- */}
                <BentoCard className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <span className="text-lg font-semibold border-r border-white/10 pr-6 flex items-center gap-2">
                            Interests
                        </span>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-white/60">
                                <Gamepad2 size={16} /> <span className="text-sm font-medium">Gaming</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-white/60">
                                <Film size={16} /> <span className="text-sm font-medium">Film Making</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-white/60">
                                <Plane size={16} /> <span className="text-sm font-medium">Traveling</span>
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* --- Experience & Education Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Experience Card 1 */}
                    <BentoCard className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold">Freelancer</h3>
                                <p className="text-white/40 text-sm">UI System Designer</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded-md">2021 - Now</span>
                        </div>
                        <div className="w-full h-px bg-white/5" />
                        <ul className="space-y-4 text-sm text-white/60">
                            <li className="flex gap-3">
                                <span className="text-white/20">•</span>
                                worked on diverse UI system and brand identity projects.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-white/20">•</span>
                                collaborated with clients from multiple countries.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-white/20">•</span>
                                developed a versatile design skill set.
                            </li>
                        </ul>
                    </BentoCard>

                    {/* Experience Card 2 */}
                    <BentoCard className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold">Meetzed</h3>
                                <p className="text-white/40 text-sm">Product Designer</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded-md">2020 - 2021</span>
                        </div>
                        <div className="w-full h-px bg-white/5" />
                        <ul className="space-y-4 text-sm text-white/60">
                            <li className="flex gap-3">
                                <span className="text-white/20">•</span>
                                Collaboration: Supported Lead Designer on projects.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-white/20">•</span>
                                Branding: Crafted unique brand identities.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-white/20">•</span>
                                Tools: Worked on design systems and prototypes.
                            </li>
                        </ul>
                    </BentoCard>

                    {/* Education Card */}
                    <BentoCard className="p-8 space-y-8 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">Graduation</h3>
                                    <p className="text-white/40 text-xs">University Degree</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded">2017-21</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">Diploma</h3>
                                    <p className="text-white/40 text-xs">Animation & Graphic Design</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded">2017-18</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">High School</h3>
                                    <p className="text-white/40 text-xs">Humanities</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded">2017</span>
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {/* --- Tools & Languages --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <BentoCard className="p-6 flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-4">
                            <span className="text-white/40 text-sm font-semibold border-r border-white/10 pr-4">Design Tools</span>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#F24E1E]/20 flex items-center justify-center text-[10px] font-bold text-[#F24E1E]">Fg</div>
                                <div className="w-8 h-8 rounded-lg bg-[#31A8FF]/20 flex items-center justify-center text-[10px] font-bold text-[#31A8FF]">Ps</div>
                                <div className="w-8 h-8 rounded-lg bg-[#FF3366]/20 flex items-center justify-center text-[10px] font-bold text-[#FF3366]">Ai</div>
                            </div>
                        </div>
                    </BentoCard>

                    <BentoCard className="p-6 flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-4">
                            <span className="text-white/40 text-sm font-semibold border-r border-white/10 pr-4">Editing Tools</span>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#9999FF]/20 flex items-center justify-center text-[10px] font-bold text-[#9999FF]">Ae</div>
                                <div className="w-8 h-8 rounded-lg bg-[#FF66FF]/20 flex items-center justify-center text-[10px] font-bold text-[#FF66FF]">Pr</div>
                            </div>
                        </div>
                    </BentoCard>

                    <BentoCard className="p-6 flex items-center justify-between group cursor-default">
                        <div className="flex items-center gap-4">
                            <span className="text-white/40 text-sm font-semibold border-r border-white/10 pr-4">Languages</span>
                            <div className="flex gap-3 text-lg">
                                <span>🇮🇳</span>
                                <span>🇺🇸</span>
                                <span>🇬🇧</span>
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {/* --- Portfolio Row --- */}
                <BentoCard className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <span className="text-lg font-bold border-r border-white/10 pr-8">Portfolio</span>
                        <div className="flex flex-wrap gap-6 text-sm font-medium text-white/40">
                            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><span>Behance</span> <ExternalLink size={14} /></a>
                            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><span>Dribbble</span> <ExternalLink size={14} /></a>
                            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><span>Instagram</span> <ExternalLink size={14} /></a>
                            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><span>LinkedIn</span> <ExternalLink size={14} /></a>
                        </div>
                    </div>
                </BentoCard>

                {/* --- Footer / Details --- */}
                <BentoCard className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                                <User size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Age</p>
                                <p className="text-sm font-medium">21 Years</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email</p>
                                <p className="text-sm font-medium">hello@abhishek.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Phone</p>
                                <p className="text-sm font-medium">+91 00000 00000</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Location</p>
                                <p className="text-sm font-medium">Delhi, India</p>
                            </div>
                        </div>
                    </div>
                </BentoCard>

            </div>
        </main>
    )
}
