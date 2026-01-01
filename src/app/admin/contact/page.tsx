"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Save, Loader2, MessageSquare, List } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/toast";

export default function AdminContact() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        contact_heading: "",
        email: "",
        availability_status: "", // Text displayed (e.g. "Available", "Busy")
        is_available: true,      // Boolean for Green/Red light
        availability_items: [] as string[],
        social_links: {
            github: "",
            x: "",
            linkedin: "",
            dribbble: ""
        }
    });

    // Temporary state for the availability tag input
    const [newTag, setNewTag] = useState("");
    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase.from("profile").select("*").single();
            if (error && error.code !== "PGRST116") throw error;
            if (data) {
                setFormData({
                    contact_heading: data.contact_heading || "Let’s build something meaningful.",
                    email: data.email || "",
                    availability_status: data.availability_status || "Available",
                    is_available: data.is_available !== false, // Default true if null
                    availability_items: data.availability_items || ["Internships", "Freelance", "Consulting"],
                    social_links: {
                        github: data.social_links?.github || "",
                        x: data.social_links?.x || "",
                        linkedin: data.social_links?.linkedin || "",
                        dribbble: data.social_links?.dribbble || ""
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching contact info:", error);
            showToast("Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: existing } = await supabase.from("profile").select("id").single();

            const payload = {
                contact_heading: formData.contact_heading,
                email: formData.email,
                availability_status: formData.availability_status,
                is_available: formData.is_available,
                availability_items: formData.availability_items,
                social_links: formData.social_links
            };

            let error;
            if (existing) {
                const { error: err } = await supabase
                    .from("profile")
                    .update(payload)
                    .eq("id", existing.id);
                error = err;
            } else {
                // Should not happen usually given profile exists, but safe fallback
                const { error: err } = await supabase
                    .from("profile")
                    .insert([payload]);
                error = err;
            }

            if (error) throw error;
            showToast("Contact page updated successfully!", "success");
        } catch (error: any) {
            showToast("Error saving: " + error.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const addTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTag.trim() && !formData.availability_items.includes(newTag.trim())) {
            setFormData({
                ...formData,
                availability_items: [...formData.availability_items, newTag.trim()]
            });
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            availability_items: formData.availability_items.filter(tag => tag !== tagToRemove)
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-white/50" /></div>;

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-12 sticky top-0 bg-[#050505]/80 backdrop-blur-xl py-4 z-40 -mx-4 px-4 md:mx-0 md:px-0">
                <Link href="/admin" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden md:inline">Back to Dashboard</span>
                </Link>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Changes</span>
                </button>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">

                {/* Section: Main Content */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageSquare className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-xl font-medium text-white">Main Heading</h2>
                    </div>
                    <div className="p-6 md:p-8 bg-[#111] border border-white/5 rounded-[32px] space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Heading Text</label>
                            <input
                                type="text"
                                value={formData.contact_heading}
                                onChange={(e) => setFormData({ ...formData, contact_heading: e.target.value })}
                                placeholder="Let’s build something meaningful."
                                className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all font-mono text-sm"
                            />
                            <p className="text-xs text-white/20">The large text displayed at the top of the contact page.</p>
                        </div>
                    </div>
                </section>

                {/* Section: Availability */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <List className="w-5 h-5 text-orange-500" />
                        <h2 className="text-xl font-medium text-white">Availability & Opportunities</h2>
                    </div>
                    <div className="p-6 md:p-8 bg-[#111] border border-white/5 rounded-[32px] space-y-6">

                        {/* Status Toggle & Text */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="space-y-3">
                                <label className="text-xs font-medium text-white/40 uppercase tracking-widest block">Availability Signal</label>
                                <button
                                    onClick={() => setFormData({ ...formData, is_available: !formData.is_available })}
                                    className={`relative w-full p-4 rounded-xl border border-white/5 flex items-center gap-4 transition-all ${formData.is_available ? "bg-emerald-500/10 hover:bg-emerald-500/20" : "bg-red-500/10 hover:bg-red-500/20"}`}
                                >
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.is_available ? "bg-emerald-500" : "bg-neutral-800"}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${formData.is_available ? "translate-x-6" : "translate-x-0"}`} />
                                    </div>
                                    <span className={`text-sm font-medium ${formData.is_available ? "text-emerald-400" : "text-white/40"}`}>
                                        {formData.is_available ? "Active (Green Light)" : "Inactive (Red Light)"}
                                    </span>
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Status Label</label>
                                <input
                                    type="text"
                                    value={formData.availability_status}
                                    onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
                                    className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/5" />

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Contact Email</label>
                            <input
                                type="text"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all font-mono text-sm"
                            />
                        </div>

                        <div className="w-full h-px bg-white/5" />

                        {/* Availability Tags */}
                        <div className="space-y-3">
                            <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Accepting Opportunities For:</label>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.availability_items.map((item, idx) => (
                                    <div key={idx} className="group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors">
                                        <span className="text-sm text-white/80">{item}</span>
                                        <button
                                            onClick={() => removeTag(item)}
                                            className="p-0.5 rounded-full hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={addTag} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add new item (e.g. Speaking)..."
                                    className="flex-1 bg-[#161616] border border-white/5 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all font-mono text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!newTag.trim()}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Section: Social Media */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-5 h-5 rounded-full border border-current text-blue-400 flex items-center justify-center text-[10px] font-bold">@</div>
                        <h2 className="text-xl font-medium text-white">Social Media Links</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 bg-[#111] border border-white/5 rounded-[32px]">
                        {Object.keys(formData.social_links).map((key) => (
                            <div key={key} className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase tracking-widest capitalize">{key}</label>
                                <input
                                    type="text"
                                    value={(formData.social_links as any)[key]}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        social_links: { ...formData.social_links, [key]: e.target.value }
                                    })}
                                    placeholder={`https://${key}.com/...`}
                                    className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all font-mono text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </section>

            </motion.div>
        </div>
    );
}
