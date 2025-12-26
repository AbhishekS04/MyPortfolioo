"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Loader2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    image_url: string;
    project_url: string;
    featured: boolean;
    display_order: number;
}

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Project>>({});
    const [techInput, setTechInput] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const { data } = await supabase
            .from("projects")
            .select("*")
            .order("display_order", { ascending: true });

        if (data) setProjects(data);
        setLoading(false);
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setFormData(project);
        setTechInput(project.tech_stack.join(", "));
    };

    const handleCreate = () => {
        setEditingId("new");
        setFormData({
            title: "",
            description: "",
            image_url: "",
            project_url: "",
            featured: false,
            display_order: projects.length + 1,
        });
        setTechInput("");
    };

    const handleSave = async () => {
        if (!formData.title) return alert("Title is required");

        const payload = {
            ...formData,
            tech_stack: techInput.split(",").map(t => t.trim()).filter(Boolean)
        };

        setLoading(true);

        if (editingId === "new") {
            await supabase.from("projects").insert([payload]);
        } else {
            await supabase.from("projects").update(payload).eq("id", editingId);
        }

        setEditingId(null);
        fetchProjects();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        await supabase.from("projects").delete().eq("id", id);
        fetchProjects();
    };

    if (loading && !projects.length) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-white/50" /></div>;

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-12 sticky top-0 bg-[#050505]/80 backdrop-blur-xl py-4 z-40 -mx-4 px-4 md:mx-0 md:px-0">
                <Link href="/admin" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden md:inline">Back to Dashboard</span>
                </Link>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                </button>
            </div>

            <div className="space-y-6">
                <h1 className="text-3xl font-medium text-white mb-8">Projects Manager</h1>

                {/* List */}
                <div className="grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={project.id}
                            className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:bg-[#161616] transition-colors"
                        >
                            {/* Image Preview */}
                            <div className="w-full md:w-32 h-32 md:h-20 rounded-lg bg-black/50 relative overflow-hidden flex-shrink-0 border border-white/5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-medium text-white truncate">{project.title}</h3>
                                    {project.featured && (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium uppercase tracking-wider border border-emerald-500/20">Featured</span>
                                    )}
                                </div>
                                <p className="text-white/40 text-sm truncate">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {project.tech_stack.map(t => (
                                        <span key={t} className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/40 border border-white/5">{t}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-center">
                                <button onClick={() => handleEdit(project)} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(project.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Edit Modal / Overlay */}
            <AnimatePresence>
                {editingId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingId(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-[32px] p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-medium text-white">
                                    {editingId === "new" ? "Create Project" : "Edit Project"}
                                </h2>
                                <button onClick={() => setEditingId(null)} className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Project Title</label>
                                        <input
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                                            placeholder="e.g. Lumina Interface"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Display Order</label>
                                        <input
                                            type="number"
                                            value={formData.display_order ?? ""}
                                            onChange={(e) => {
                                                const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                                                setFormData({ ...formData, display_order: isNaN(val) ? 0 : val });
                                            }}
                                            className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none resize-none"
                                        placeholder="Brief description of the project..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Tech Stack (comma separated)</label>
                                    <input
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                                        placeholder="React, TypeScript, Tailwind..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <ImageIcon className="w-3 h-3" /> Image URL (Cloud only)
                                    </label>
                                    <input
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none font-mono text-xs"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <LinkIcon className="w-3 h-3" /> Project Link
                                    </label>
                                    <input
                                        value={formData.project_url}
                                        onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none font-mono text-xs"
                                        placeholder="/works/project-name or https://..."
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                                        className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${formData.featured
                                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                            : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                                            }`}
                                    >
                                        {formData.featured ? "Featured Project" : "Mark as Featured"}
                                    </button>
                                </div>

                                <div className="pt-6">
                                    <button
                                        onClick={handleSave}
                                        className="w-full py-4 rounded-xl bg-white text-black font-medium text-lg hover:bg-white/90 active:scale-[0.98] transition-all"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Save Project"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
