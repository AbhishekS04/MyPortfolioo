"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, Loader2, Link as LinkIcon, Image as ImageIcon, CheckCircle, Activity, Github, Video, FileText, Settings, Layout } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type ProjectStatus = 'Not Started' | 'In Progress' | 'Near Completion' | 'Completed';
type ProjectType = 'Personal' | 'Client';
type MediaMode = 'gallery' | 'video_first';

interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    tech_stack: string[];
    image_url: string;
    // New Fields
    project_type: ProjectType;
    client_name?: string;
    external_link_label: string;
    external_link_url?: string;
    github_url?: string;

    // Media
    video_url?: string;
    media_mode: MediaMode;
    gallery_images: string[];

    // Rich Content
    overview?: string;
    problem_statement?: string;
    approach?: string;
    features?: string;
    challenges?: string;
    outcome?: string;

    featured: boolean;
    display_order: number;
    status: ProjectStatus;
    is_currently_working: boolean;
    progress_percentage?: number;
    project_url: string; // Keeping for backward compatibility or redirection
}

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'essentials' | 'media' | 'content' | 'settings'>('essentials');

    // Form State
    const [formData, setFormData] = useState<Partial<Project>>({});
    const [techInput, setTechInput] = useState("");
    const [galleryInput, setGalleryInput] = useState("");

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
        setTechInput(project.tech_stack?.join(", ") || "");
        setGalleryInput(project.gallery_images?.join("\n") || ""); // Newline separated for easy editing
        setActiveTab('essentials');
    };

    const handleCreate = () => {
        setEditingId("new");
        setFormData({
            title: "",
            slug: "",
            description: "",
            image_url: "",
            project_url: "",
            featured: false,
            display_order: projects.length + 1,
            status: 'Not Started',
            is_currently_working: false,
            progress_percentage: 0,
            project_type: 'Personal',
            media_mode: 'gallery',
            gallery_images: [],
            external_link_label: 'Live Demo'
        });
        setTechInput("");
        setGalleryInput("");
        setActiveTab('essentials');
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleSave = async () => {
        if (!formData.title) return alert("Title is required");

        // Auto-generate slug if missing
        let finalSlug = formData.slug || generateSlug(formData.title);

        const payload = {
            ...formData,
            slug: finalSlug,
            tech_stack: techInput.split(",").map(t => t.trim()).filter(Boolean),
            gallery_images: galleryInput.split("\n").map(s => s.trim()).filter(Boolean)
        };

        setLoading(true);

        // Logic: If 'is_currently_working' is true, set false for others
        if (payload.is_currently_working) {
            await supabase.from("projects").update({ is_currently_working: false }).neq("id", "00000000-0000-0000-0000-000000000000");
        }

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
                            className={`bg-[#111] border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:bg-[#161616] transition-colors ${project.is_currently_working ? 'border-emerald-500/30' : 'border-white/5'}`}
                        >
                            {/* Image Preview */}
                            <div className="w-full md:w-32 h-32 md:h-20 rounded-lg bg-black/50 relative overflow-hidden flex-shrink-0 border border-white/5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-medium text-white truncate">{project.title}</h3>
                                    <span className="text-xs text-white/30 font-mono hidden md:inline-block">/works/{project.slug}</span>
                                    {project.is_currently_working && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium uppercase tracking-wider border border-emerald-500/20">
                                            <Activity className="w-3 h-3" /> Working
                                        </span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${project.status === 'Completed' ? 'bg-white/10 text-white/60 border-white/10' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <p className="text-white/40 text-sm truncate">{project.description}</p>
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
                            className="relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-[32px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Hedaer */}
                            <div className="flex items-center justify-between p-8 pb-4 border-b border-white/5 bg-[#111]">
                                <div>
                                    <h2 className="text-2xl font-medium text-white">
                                        {editingId === "new" ? "Create Project" : "Edit Project"}
                                    </h2>
                                    <p className="text-white/40 text-sm mt-1">Manage project details and case study content.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 rounded-full bg-white text-black font-medium hover:bg-white/90 active:scale-[0.98] transition-all flex items-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-6 px-8 border-b border-white/5 bg-[#111]">
                                {[
                                    { id: 'essentials', label: 'Essentials', icon: Layout },
                                    { id: 'media', label: 'Media & Gallery', icon: ImageIcon },
                                    { id: 'content', label: 'Case Study', icon: FileText },
                                    { id: 'settings', label: 'Settings', icon: Settings },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-white text-white' : 'border-transparent text-white/40 hover:text-white/60'}`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="space-y-8">

                                    {/* --- ESSENTIALS TAB --- */}
                                    {activeTab === 'essentials' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Title</label>
                                                    <input
                                                        value={formData.title || ""}
                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: !formData.slug ? generateSlug(e.target.value) : formData.slug })}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                                                        placeholder="Project Name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Slug (URL)</label>
                                                    <input
                                                        value={formData.slug || ""}
                                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none font-mono text-sm text-white/60"
                                                        placeholder="project-name-slug"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Short Summary (Hero Description)</label>
                                                <textarea
                                                    value={formData.description || ""}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={3}
                                                    className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none resize-none"
                                                    placeholder="A brief 1-2 line description..."
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

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Project Type</label>
                                                    <select
                                                        value={formData.project_type || 'Personal'}
                                                        onChange={(e) => setFormData({ ...formData, project_type: e.target.value as ProjectType })}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none appearance-none"
                                                    >
                                                        <option value="Personal">Personal Project</option>
                                                        <option value="Client">Client Project</option>
                                                    </select>
                                                </div>
                                                {formData.project_type === 'Client' && (
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Client Name</label>
                                                        <input
                                                            value={formData.client_name || ""}
                                                            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                                            className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                                                            placeholder="Acme Corp"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* --- MEDIA TAB --- */}
                                    {activeTab === 'media' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
                                                    <ImageIcon className="w-3 h-3" /> Main Cover Image (Required)
                                                </label>
                                                <input
                                                    value={formData.image_url || ""}
                                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                    className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none font-mono text-xs"
                                                    placeholder="https://..."
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
                                                        <Video className="w-3 h-3" /> Video URL (Optional)
                                                    </label>
                                                    <input
                                                        value={formData.video_url || ""}
                                                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none font-mono text-xs"
                                                        placeholder="https://... (mp4/webm)"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Media Mode</label>
                                                    <select
                                                        value={formData.media_mode || 'gallery'}
                                                        onChange={(e) => setFormData({ ...formData, media_mode: e.target.value as MediaMode })}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none appearance-none"
                                                    >
                                                        <option value="gallery">Gallery Only</option>
                                                        <option value="video_first">Video First (then Gallery)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Gallery Images (One URL per line)</label>
                                                <textarea
                                                    value={galleryInput}
                                                    onChange={(e) => setGalleryInput(e.target.value)}
                                                    rows={6}
                                                    className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none font-mono text-xs whitespace-pre"
                                                    placeholder={"https://image1.jpg\nhttps://image2.jpg"}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* --- CONTENT TAB --- */}
                                    {activeTab === 'content' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Project Overview</label>
                                                <textarea
                                                    value={formData.overview || ""}
                                                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                                                    rows={4}
                                                    className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                                                    placeholder="Detailed overview of the project context..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">The Problem</label>
                                                    <textarea
                                                        value={formData.problem_statement || ""}
                                                        onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                                                        rows={4}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                                                        placeholder="What challenge were you solving?"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">The Approach / Solution</label>
                                                    <textarea
                                                        value={formData.approach || ""}
                                                        onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                                                        rows={4}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                                                        placeholder="How did you tackle it?"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Key Features (List or Text)</label>
                                                <textarea
                                                    value={formData.features || ""}
                                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                                    rows={4}
                                                    className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                                                    placeholder="• Feature 1&#10;• Feature 2"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Challenges</label>
                                                    <textarea
                                                        value={formData.challenges || ""}
                                                        onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                                                        rows={3}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Outcome / Results</label>
                                                    <textarea
                                                        value={formData.outcome || ""}
                                                        onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                                                        rows={3}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- SETTINGS TAB --- */}
                                    {activeTab === 'settings' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Project Status</label>
                                                    <select
                                                        value={formData.status || 'Not Started'}
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none appearance-none"
                                                    >
                                                        <option value="Not Started">Not Started</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Near Completion">Near Completion</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
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

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
                                                        External Link (Demo)
                                                    </label>
                                                    <input
                                                        value={formData.external_link_url || ""}
                                                        onChange={(e) => setFormData({ ...formData, external_link_url: e.target.value })}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none font-mono text-xs"
                                                        placeholder="https://example.com"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
                                                        <Github className="w-3 h-3" /> GitHub Repo
                                                    </label>
                                                    <input
                                                        value={formData.github_url || ""}
                                                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-white/20 focus:outline-none font-mono text-xs"
                                                        placeholder="https://github.com/..."
                                                    />
                                                </div>
                                            </div>

                                            {formData.is_currently_working && (
                                                <div className="space-y-2 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                                                    <label className="text-xs font-medium text-emerald-400 uppercase tracking-widest flex justify-between mb-2">
                                                        <span>Manual Progress Override: {formData.progress_percentage ?? 0}%</span>
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={formData.progress_percentage ?? 0}
                                                        onChange={(e) => setFormData({ ...formData, progress_percentage: parseInt(e.target.value) })}
                                                        className="w-full h-2 bg-emerald-500/30 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-3 pt-4">
                                                <button
                                                    onClick={() => setFormData({ ...formData, is_currently_working: !formData.is_currently_working })}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium flex items-center justify-center gap-2 ${formData.is_currently_working
                                                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                                        : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                                                        }`}
                                                >
                                                    <Activity className="w-4 h-4" />
                                                    {formData.is_currently_working ? "Status: Currently Working on This" : "Set as 'Currently Working'"}
                                                </button>

                                                <button
                                                    onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium flex items-center justify-center gap-2 ${formData.featured
                                                        ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                                        : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                                                        }`}
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    {formData.featured ? "Status: Featured in All Projects" : "Mark as Featured"}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
