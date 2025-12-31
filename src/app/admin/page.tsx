"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    LogOut,
    LayoutDashboard,
    Layers,
    User,
    Image as ImageIcon,
    Settings,
    Cpu,
    Zap,
    ExternalLink,
    FileText
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RatingStatsCard } from "@/components/admin/rating-stats-card";

function AdminCard({ href, icon: Icon, label, description, delay = 0 }: any) {
    return (
        <Link href={href} className="block group">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay }}
                className="relative overflow-hidden p-6 rounded-[28px] bg-[#111111] border border-white/5 group-hover:bg-[#161616] group-hover:border-white/10 transition-all duration-300 h-full"
            >
                {/* Gradient Glow on Hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-white mb-1 group-hover:translate-x-1 transition-transform">{label}</h3>
                        <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">{description}</p>
                    </div>

                    <div className="flex items-center text-xs font-medium text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">
                        <span>Manage</span>
                        <ExternalLink className="w-3 h-3 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

export default function AdminDashboard() {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/admin/login");
    };

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                <div className="space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-5xl font-medium text-white tracking-tight"
                    >
                        Command Center
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/40 text-lg"
                    >
                        Welcome back, Admin. System is operational.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <button
                        onClick={async () => {
                            const { createClient } = await import("@/utils/supabase/client");
                            const supabase = createClient();
                            await supabase.auth.signOut();
                            window.location.href = "/admin/login";
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all text-sm font-medium border border-red-500/10"
                    >
                        <LogOut className="w-4 h-4" />
                        End Session
                    </button>
                </motion.div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AdminCard
                    href="/admin/projects"
                    icon={Layers}
                    label="Projects"
                    description="Manage your portfolio cases, images, and tech stacks."
                    delay={0.1}
                />
                <AdminCard
                    href="/admin/profile"
                    icon={User}
                    label="Profile & Bio"
                    description="Update your signature, location, focus area, and bio text."
                    delay={0.2}
                />
                <AdminCard
                    href="/admin/tech"
                    icon={Cpu}
                    label="Tech Stack"
                    description="Edit the marquee icons and their display order."
                    delay={0.3}
                />
                <AdminCard
                    href="/admin/stories"
                    icon={Zap}
                    label="Social Stories"
                    description="Update the avatar ring stories and link destinations."
                    delay={0.4}
                />
                <AdminCard
                    href="/admin/gallery"
                    icon={ImageIcon}
                    label="Hero Gallery"
                    description="Change the images in the vertical stack on the home page."
                    delay={0.5}
                />
                <AdminCard
                    href="/admin/about"
                    icon={FileText}
                    label="About Page"
                    description="Manage bio, experience, education, skills, and interests."
                    delay={0.6}
                />
                <AdminCard
                    href="/admin/settings"
                    icon={Settings}
                    label="Global Settings"
                    description="System-wide configurations and toggles."
                    delay={0.7}
                />
            </div>

            {/* Rating Stats Section */}
            <div className="mt-6">
                <RatingStatsCard />
            </div>

            {/* Status Bar */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:w-auto bg-[#111] border border-white/10 rounded-full px-6 py-3 flex items-center justify-between md:justify-start gap-6 backdrop-blur-xl shadow-2xl z-50"
            >
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Database Connected</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10" />
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Secure Mode</span>
                </div>
            </motion.div>
        </div>
    );
}
