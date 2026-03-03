"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Plus, Trash2, GripVertical, Save, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, Reorder } from "framer-motion";
import { SiCplusplus, SiHtml5, SiCss, SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiBootstrap, SiTailwindcss, SiNodedotjs, SiPython, SiRust, SiGo, SiMongodb, SiPostgresql, SiSupabase, SiFigma, SiDocker, SiGit } from "react-icons/si";
import { FaJava } from "react-icons/fa";

// Mapping of available icons
const ICON_MAP: Record<string, any> = {
    "cpp": SiCplusplus,
    "java": FaJava,
    "html": SiHtml5,
    "css": SiCss,
    "js": SiJavascript,
    "ts": SiTypescript,
    "react": SiReact,
    "next": SiNextdotjs,
    "bootstrap": SiBootstrap,
    "tailwind": SiTailwindcss,
    "node": SiNodedotjs,
    "python": SiPython,
    "rust": SiRust,
    "go": SiGo,
    "mongo": SiMongodb,
    "postgres": SiPostgresql,
    "supabase": SiSupabase,
    "figma": SiFigma,
    "docker": SiDocker,
    "git": SiGit,
};

interface TechItem {
    id: string;
    name: string;
    icon_key: string;
    display_order: number;
}

export default function AdminTech() {
    const [items, setItems] = useState<TechItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ name: "", icon_key: "js" });
    const supabase = createClient();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const { data, error } = await supabase
            .from("tech_stack")
            .select("*")
            .order("display_order", { ascending: true });

        if (error) {
            console.error(error);
            alert("Error fetching tech stack: " + error.message);
        }

        if (data) setItems(data);
        setLoading(false);
    };

    const handleReorder = (newOrder: TechItem[]) => {
        setItems(newOrder);
        // Debounced save would be better, but direct failing works for small lists
    };

    const saveOrder = async () => {
        setLoading(true);
        const updates = items.map((item, index) => ({
            id: item.id,
            display_order: index + 1,
        }));

        for (const update of updates) {
            await supabase.from("tech_stack").update({ display_order: update.display_order }).eq("id", update.id);
        }
        setLoading(false);
        alert("Order updated!");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this tech?")) return;
        await supabase.from("tech_stack").delete().eq("id", id);
        fetchItems();
    };

    const handleAdd = async () => {
        if (!newItem.name) return;
        setLoading(true);
        await supabase.from("tech_stack").insert([{
            name: newItem.name,
            icon_key: newItem.icon_key,
            display_order: items.length + 1
        }]);
        setNewItem({ name: "", icon_key: "js" });
        setIsAdding(false);
        fetchItems();
    };

    if (loading && !items.length) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-white/50" /></div>;

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-12 sticky top-0 bg-[#050505]/80 backdrop-blur-xl py-4 z-40 -mx-4 px-4 md:mx-0 md:px-0">
                <Link href="/admin" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden md:inline">Back to Dashboard</span>
                </Link>
                <div className="flex gap-2">
                    <button
                        onClick={() => saveOrder()}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 active:scale-95 transition-all"
                    >
                        <Save className="w-4 h-4" />
                        <span className="hidden md:inline">Save Order</span>
                    </button>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden md:inline">Add Tech</span>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <h1 className="text-3xl font-medium text-white mb-2">Tech Stack Manager</h1>
                <p className="text-white/40 text-sm mb-8">Drag to reorder. These icons appear in the Marquee.</p>

                <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3">
                    {items.map((item) => {
                        const Icon = ICON_MAP[item.icon_key] || SiJavascript;
                        return (
                            <Reorder.Item key={item.id} value={item} className="bg-[#111] border border-white/5 rounded-xl p-4 flex items-center gap-4 cursor-grab active:cursor-grabbing hover:border-white/10 transition-colors">
                                <GripVertical className="w-5 h-5 text-white/20" />
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">{item.name}</h3>
                                    <p className="text-xs text-white/30 font-mono">{item.icon_key}</p>
                                </div>
                                <button onClick={() => handleDelete(item.id)} className="p-2 rounded hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </Reorder.Item>
                        )
                    })}
                </Reorder.Group>
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md bg-[#161616] border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-xl font-medium text-white mb-6">Add Technology</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-white/40 uppercase tracking-widest block mb-2">Display Name</label>
                                <input
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20"
                                    placeholder="e.g. React Native"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-white/40 uppercase tracking-widest block mb-2">Icon Key</label>
                                <select
                                    value={newItem.icon_key}
                                    onChange={(e) => setNewItem({ ...newItem, icon_key: e.target.value })}
                                    className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 appearance-none"
                                >
                                    {Object.keys(ICON_MAP).sort().map(key => (
                                        <option key={key} value={key}>{key}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-white/30 mt-2">Select from supported icon library.</p>
                            </div>

                            <button
                                onClick={handleAdd}
                                className="w-full py-4 rounded-xl bg-white text-black font-medium mt-4 hover:bg-white/90"
                            >
                                Add to Stack
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
