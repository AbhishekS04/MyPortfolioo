"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import {
    Gamepad2,
    Film,
    Plane,
    Mail,
    Phone,
    MapPin,
    User,
    Download,
    ExternalLink
} from "lucide-react";
import { RatingInteraction } from "@/components/ui/emoji-rating";

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
);

const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
        {children}
    </span>
);

export function AboutClient({ general, experience, education, skills, interests }: any) {

    // Helper to dynamic icon
    const getIcon = (name: string) => {
        const Icon = (LucideIcons as any)[name];
        return Icon ? <Icon size={16} /> : <Gamepad2 size={16} />;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 px-4 md:px-8 lg:px-12 pt-24 md:pt-32 pb-20">

            {/* --- Top Row: Profile & Bio --- */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                <BentoCard className="md:col-span-4 h-[320px] relative group">
                    <Image
                        src={general.profile_image_url || "https://res.cloudinary.com/dap0u41dz/image/upload/v1766771167/file_00000000d51472078b7e2f9d883a6674_majhmb.jpg"}
                        alt={general.full_name}
                        fill
                        className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <h1 className="text-xl md:text-2xl font-bold">{general.full_name}</h1>
                        <p className="text-white/40 text-sm italic">{general.role_title}</p>
                    </div>
                </BentoCard>

                <BentoCard className="md:col-span-8 p-5 md:p-8 flex flex-col justify-center">
                    <p className="text-lg md:text-2xl font-medium leading-relaxed text-white/90 whitespace-pre-line">
                        {general.bio_description}
                    </p>
                    <div className="mt-6 md:mt-8 flex flex-wrap gap-2 md:gap-3">
                        <Badge>Founder</Badge>
                        <Badge>Product Designer</Badge>
                        <Badge>Systems Thinker</Badge>
                    </div>
                </BentoCard>
            </div>

            {/* --- Interests Row --- */}
            <BentoCard className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    <span className="text-lg font-semibold border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 flex items-center gap-2 w-full md:w-auto">
                        Interests
                    </span>
                    <div className="flex flex-wrap gap-3 md:gap-4">
                        {interests.map((item: any, idx: number) => {
                            const isGaming = item.label === "Gaming";
                            const content = (
                                <>
                                    {getIcon(item.icon_name)}
                                    <span className="text-sm font-medium">{item.label}</span>
                                </>
                            );
                            const itemClassName = `
                                flex items-center gap-2 px-3 md:px-4 py-2 rounded-2xl border transition-all duration-300
                                ${isGaming
                                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 cursor-pointer hover:bg-emerald-500/10 hover:scale-105"
                                    : "bg-white/[0.03] border-white/5 text-white/60"
                                }
                            `;

                            if (isGaming) {
                                return (
                                    <Link key={idx} href="/gaming" className={itemClassName}>
                                        {content}
                                    </Link>
                                );
                            }

                            return (
                                <div key={idx} className={itemClassName}>
                                    {content}
                                </div>
                            );
                        })}
                        {interests.length === 0 && <span className="text-sm text-white/20">No interests added yet.</span>}
                    </div>
                </div>
            </BentoCard>

            {/* --- Experience & Education Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

                {/* Experience Cards */}
                {experience.map((exp: any, idx: number) => (
                    <BentoCard key={exp.id} className="p-5 md:p-8 space-y-4 md:space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold">{exp.role}</h3>
                                <p className="text-white/40 text-sm">{exp.company}</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded-md whitespace-nowrap ml-2">{exp.period}</span>
                        </div>
                        <div className="w-full h-px bg-white/5" />
                        <ul className="space-y-3 md:space-y-4 text-sm text-white/60">
                            {exp.description_points?.map((pt: string, i: number) => (
                                <li key={i} className="flex gap-3">
                                    <span className="text-white/20">•</span>
                                    {pt}
                                </li>
                            ))}
                        </ul>
                    </BentoCard>
                ))}

                {/* Education Card (Consolidated) */}
                <BentoCard className="p-5 md:p-8 flex flex-col justify-start">
                    <div className="space-y-4 md:space-y-5">
                        {education.map((edu: any, idx: number) => (
                            <div key={edu.id} className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold">{edu.degree}</h3>
                                    <p className="text-white/40 text-xs">{edu.institution}</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded ml-2 whitespace-nowrap">{edu.year}</span>
                            </div>
                        ))}
                        {education.length === 0 && <p className="text-sm text-white/40">No education added.</p>}
                    </div>
                </BentoCard>
            </div>



            {/* --- Portfolio Row --- */}
            <BentoCard className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <span className="text-lg font-bold border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-8 w-full md:w-auto">Portfolio</span>
                    <div className="flex flex-wrap gap-4 md:gap-6 text-sm font-medium text-white/40">
                        <a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><span>Behance</span> <ExternalLink size={14} /></a>
                        <a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><span>Dribbble</span> <ExternalLink size={14} /></a>
                        <a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><span>Instagram</span> <ExternalLink size={14} /></a>
                        <a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><span>LinkedIn</span> <ExternalLink size={14} /></a>
                    </div>
                </div>
            </BentoCard>

            {/* --- Availability & Feedback Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Availability Block */}
                <BentoCard className="p-5 md:p-8">
                    <div className="flex flex-col h-full justify-between gap-6 md:gap-8">
                        <div>
                            <h3 className="text-lg md:text-xl font-bold mb-4">Availability</h3>
                            <p className="text-white/40 text-sm leading-relaxed mb-6">
                                I am currently open to new opportunities and collaborations. I specialize in building scalable UI systems and fluid frontend experiences.
                            </p>
                            <div className="space-y-3 md:space-y-4">
                                {["Internships", "Freelance", "Consulting"].map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <div className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </div>
                                        <span className="text-sm font-medium text-white/80">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border w-fit transition-colors ${general.is_available ? "bg-emerald-500/5 border-emerald-500/10" : "bg-red-500/5 border-red-500/10"}`}>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${general.is_available ? "text-emerald-500" : "text-red-500"}`}>
                                {general.availability_status}
                            </span>
                        </div>
                    </div>
                </BentoCard>

                {/* Quick Feedback (Rating) Block */}
                <BentoCard className="p-5 md:p-8 flex flex-col items-center justify-center text-center max-h-[300px] md:max-h-none">
                    <RatingInteraction />
                </BentoCard>
            </div>

            {/* --- Footer / Details --- */}
            <BentoCard className="p-5 md:p-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                            <User size={16} className="md:w-[18px] md:h-[18px]" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Age</p>
                            <p className="text-xs md:text-sm font-medium">
                                {general.birthday ? (
                                    `${Math.floor((Date.now() - new Date(general.birthday).getTime()) / 31557600000)} Years`
                                ) : "21 Years"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 group cursor-pointer" onClick={() => window.location.href = `mailto:${general.contact_email}`}>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white/10 transition-colors">
                            <Mail size={16} className="md:w-[18px] md:h-[18px]" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email</p>
                            <p className="text-xs md:text-sm font-medium truncate max-w-[100px] md:max-w-[150px]">{general.contact_email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                            <Phone size={16} className="md:w-[18px] md:h-[18px]" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Phone</p>
                            <p className="text-xs md:text-sm font-medium truncate max-w-[100px] md:max-w-none">{general.phone_number || "+91 0000000000"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                            <MapPin size={16} className="md:w-[18px] md:h-[18px]" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Location</p>
                            <p className="text-xs md:text-sm font-medium">{general.location || "Kolkata, India"}</p>
                        </div>
                    </div>
                </div>
            </BentoCard>

        </div>
    );
}
