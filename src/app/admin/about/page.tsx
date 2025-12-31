"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/toast";

export default function AdminAbout() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data States
    const [general, setGeneral] = useState<any>({});
    const [experience, setExperience] = useState<any[]>([]);
    const [education, setEducation] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [interests, setInterests] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [genRes, expRes, eduRes, skiRes, intRes] = await Promise.all([
                supabase.from("about_general").select("*").single(),
                supabase.from("about_experience").select("*").order("display_order", { ascending: true }),
                supabase.from("about_education").select("*").order("display_order", { ascending: true }),
                supabase.from("about_skills").select("*").order("display_order", { ascending: true }),
                supabase.from("about_interests").select("*").order("display_order", { ascending: true })
            ]);

            if (genRes.data) setGeneral(genRes.data);
            if (expRes.data) setExperience(expRes.data);
            if (eduRes.data) setEducation(eduRes.data);
            if (skiRes.data) setSkills(skiRes.data);
            if (intRes.data) setInterests(intRes.data);

        } catch (error) {
            console.error("Error fetching about data:", error);
            showToast("Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Save General
            if (general.id) {
                await supabase.from("about_general").update({
                    full_name: general.full_name,
                    role_title: general.role_title,
                    bio_description: general.bio_description,
                    availability_status: general.availability_status,
                    is_available: general.is_available,
                    contact_email: general.contact_email
                }).eq("id", general.id);
            }

            // 2. Upsert Experience
            for (const item of experience) {
                const payload = {
                    role: item.role,
                    company: item.company,
                    period: item.period,
                    description_points: item.description_points,
                    display_order: item.display_order
                };
                if (item.id.includes("temp")) {
                    await supabase.from("about_experience").insert([{ ...payload }]);
                } else {
                    await supabase.from("about_experience").update(payload).eq("id", item.id);
                }
            }

            // 3. Upsert Education
            for (const item of education) {
                const payload = {
                    degree: item.degree,
                    institution: item.institution,
                    year: item.year,
                    display_order: item.display_order
                };
                if (item.id.includes("temp")) {
                    await supabase.from("about_education").insert([{ ...payload }]);
                } else {
                    await supabase.from("about_education").update(payload).eq("id", item.id);
                }
            }

            // 4. Upsert Skills
            for (const item of skills) {
                const payload = {
                    category: item.category,
                    name: item.name,
                    icon_name: item.icon_name,
                    color_code: item.color_code,
                    display_order: item.display_order
                };
                if (item.id.includes("temp")) {
                    await supabase.from("about_skills").insert([{ ...payload }]);
                } else {
                    await supabase.from("about_skills").update(payload).eq("id", item.id);
                }
            }

            // 5. Upsert Interests
            for (const item of interests) {
                const payload = {
                    label: item.label,
                    icon_name: item.icon_name,
                    display_order: item.display_order
                };
                if (item.id.includes("temp")) {
                    await supabase.from("about_interests").insert([{ ...payload }]);
                } else {
                    await supabase.from("about_interests").update(payload).eq("id", item.id);
                }
            }

            showToast("About Information updated!", "success");
            fetchData(); // Refresh to clean temp IDs
        } catch (error: any) {
            showToast("Error saving: " + error.message, "error");
        } finally {
            setSaving(false);
        }
    };

    // Helper to delete items
    const handleDelete = async (table: string, id: string, setter: any, list: any[]) => {
        if (!id.includes("temp")) {
            await supabase.from(table).delete().eq("id", id);
        }
        setter(list.filter(i => i.id !== id));
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-white/50" /></div>;

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-12 sticky top-0 bg-[#050505]/80 backdrop-blur-xl py-4 z-40 -mx-4 px-4 md:mx-0 md:px-0">
                <Link href="/admin" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden md:inline">Back to Dashboard</span>
                </Link>
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">

                {/* 1. General Info */}
                <section className="space-y-6">
                    <h2 className="text-xl font-medium text-white">General Information</h2>
                    <div className="p-6 md:p-8 bg-[#111] border border-white/5 rounded-[32px] space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Full Name" value={general.full_name} onChange={(v: string) => setGeneral({ ...general, full_name: v })} />
                            <Input label="Role Title" value={general.role_title} onChange={(v: string) => setGeneral({ ...general, role_title: v })} />
                        </div>
                        <TextArea label="Bio Description" value={general.bio_description} onChange={(v: string) => setGeneral({ ...general, bio_description: v })} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Contact Email" value={general.contact_email} onChange={(v: string) => setGeneral({ ...general, contact_email: v })} />
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Availability</label>
                                <button
                                    onClick={() => setGeneral({ ...general, is_available: !general.is_available })}
                                    className={`w-full p-3 rounded-xl border border-white/5 flex items-center gap-3 transition-colors ${general.is_available ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${general.is_available ? "bg-emerald-500" : "bg-red-500"}`} />
                                    {general.is_available ? "Available" : "Busy"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Experience */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium text-white">Experience</h2>
                        <button onClick={() => setExperience([...experience, { id: `temp-${Date.now()}`, role: "New Role", company: "Company", period: "2024", description_points: [], display_order: experience.length }])} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><Plus className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-4">
                        {experience.map((item, idx) => (
                            <div key={item.id} className="p-6 bg-[#111] border border-white/5 rounded-2xl flex flex-col gap-4 group">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Input label="Role" value={item.role} onChange={(v: string) => {
                                            const f = [...experience]; f[idx] = { ...f[idx], role: v }; setExperience(f);
                                        }} />
                                        <Input label="Company" value={item.company} onChange={(v: string) => {
                                            const f = [...experience]; f[idx] = { ...f[idx], company: v }; setExperience(f);
                                        }} />
                                        <Input label="Period" value={item.period} onChange={(v: string) => {
                                            const f = [...experience]; f[idx] = { ...f[idx], period: v }; setExperience(f);
                                        }} />
                                    </div>
                                    <button onClick={() => handleDelete("about_experience", item.id, setExperience, experience)} className="p-2 text-white/20 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
                                </div>
                                <TextArea label="Description Points (One per line)" value={item.description_points?.join("\n") || ""} onChange={(v: string) => {
                                    const f = [...experience]; f[idx] = { ...f[idx], description_points: v.split("\n") }; setExperience(f);
                                }} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Education */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium text-white">Education</h2>
                        <button onClick={() => setEducation([...education, { id: `temp-${Date.now()}`, degree: "Degree", institution: "University", year: "2024", display_order: education.length }])} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><Plus className="w-5 h-5" /></button>
                    </div>
                    <div className="space-y-4">
                        {education.map((item, idx) => (
                            <div key={item.id} className="p-6 bg-[#111] border border-white/5 rounded-2xl flex items-start gap-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input label="Degree" value={item.degree} onChange={(v: string) => {
                                        const f = [...education]; f[idx] = { ...f[idx], degree: v }; setEducation(f);
                                    }} />
                                    <Input label="Institution" value={item.institution} onChange={(v: string) => {
                                        const f = [...education]; f[idx] = { ...f[idx], institution: v }; setEducation(f);
                                    }} />
                                    <Input label="Year" value={item.year} onChange={(v: string) => {
                                        const f = [...education]; f[idx] = { ...f[idx], year: v }; setEducation(f);
                                    }} />
                                </div>
                                <button onClick={() => handleDelete("about_education", item.id, setEducation, education)} className="p-2 text-white/20 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Skills */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium text-white">Skills</h2>
                        <button onClick={() => setSkills([...skills, { id: `temp-${Date.now()}`, name: "Skill", icon_name: "Xi", category: "design", color_code: "#FFFFFF", display_order: skills.length }])} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><Plus className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills.map((item, idx) => (
                            <div key={item.id} className="p-4 bg-[#111] border border-white/5 rounded-2xl flex flex-col gap-3 relative group">
                                <button onClick={() => handleDelete("about_skills", item.id, setSkills, skills)} className="absolute top-2 right-2 p-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Name" value={item.name} onChange={(v: string) => {
                                        const f = [...skills]; f[idx] = { ...f[idx], name: v }; setSkills(f);
                                    }} />
                                    <Input label="Shortcode (Eg. Ps)" value={item.icon_name} onChange={(v: string) => {
                                        const f = [...skills]; f[idx] = { ...f[idx], icon_name: v }; setSkills(f);
                                    }} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Category</label>
                                        <select
                                            value={item.category}
                                            onChange={e => {
                                                const f = [...skills];
                                                f[idx] = { ...f[idx], category: e.target.value };
                                                setSkills(f);
                                            }}
                                            className="w-full bg-[#161616] border border-white/5 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                                        >
                                            <option value="design">Design</option>
                                            <option value="editing">Editing</option>
                                            <option value="language">Language</option>
                                        </select>
                                    </div>
                                    <Input label="Color (Hex)" value={item.color_code} onChange={(v: string) => {
                                        const f = [...skills]; f[idx] = { ...f[idx], color_code: v }; setSkills(f);
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Interests */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-medium text-white">Interests</h2>
                        <button onClick={() => setInterests([...interests, { id: `temp-${Date.now()}`, label: "Interest", icon_name: "Gamepad2", display_order: interests.length }])} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><Plus className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {interests.map((item, idx) => (
                            <div key={item.id} className="p-4 bg-[#111] border border-white/5 rounded-2xl flex items-center gap-3 relative group">
                                <div className="flex-1 space-y-2">
                                    <Input label="Label" value={item.label} onChange={(v: string) => {
                                        const f = [...interests]; f[idx] = { ...f[idx], label: v }; setInterests(f);
                                    }} />
                                    <Input label="Lucide Icon Name" value={item.icon_name} onChange={(v: string) => {
                                        const f = [...interests]; f[idx] = { ...f[idx], icon_name: v }; setInterests(f);
                                    }} />
                                </div>
                                <button onClick={() => handleDelete("about_interests", item.id, setInterests, interests)} className="p-2 text-white/20 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </section>

            </motion.div>
        </div>
    );
}

// UI Helpers
const Input = ({ label, value, onChange }: any) => (
    <div className="space-y-1 w-full">
        <label className="text-[10px] font-medium text-white/40 uppercase tracking-widest">{label}</label>
        <input
            type="text"
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-[#161616] border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-all text-sm"
        />
    </div>
);

const TextArea = ({ label, value, onChange }: any) => (
    <div className="space-y-1 w-full">
        <label className="text-[10px] font-medium text-white/40 uppercase tracking-widest">{label}</label>
        <textarea
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            rows={4}
            className="w-full bg-[#161616] border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-all text-sm resize-none"
        />
    </div>
);
