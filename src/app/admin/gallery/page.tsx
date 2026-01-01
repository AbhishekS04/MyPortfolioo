"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Reorder } from "framer-motion";

interface GalleryImage {
    id: string;
    image_url: string;
    alt_text: string;
    display_order: number;
}

export default function AdminGallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ image_url: "", alt_text: "" });
    const supabase = createClient();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        const { data, error } = await supabase.from("gallery_images").select("*").order("display_order", { ascending: true });
        if (error) {
            console.error("Error fetching images:", error);
            alert("Error fetching images: " + error.message);
        }
        if (data) setImages(data);
        setLoading(false);
    };

    const handleReorder = (newOrder: GalleryImage[]) => {
        setImages(newOrder);
    };

    const saveOrder = async () => {
        setLoading(true);
        const updates = images.map((img, index) => ({ id: img.id, display_order: index + 1 }));

        let hasError = false;
        for (const update of updates) {
            const { error } = await supabase.from("gallery_images").update({ display_order: update.display_order }).eq("id", update.id);
            if (error) {
                console.error("Error saving order:", error);
                hasError = true;
            }
        }

        setLoading(false);
        if (hasError) {
            alert("Some errors occurred while saving order. Check console.");
        } else {
            alert("Order saved!");
        }
    };

    const handleAdd = async () => {
        if (!newItem.image_url) return;
        setLoading(true);
        const { error } = await supabase.from("gallery_images").insert([{ ...newItem, display_order: images.length + 1 }]);

        if (error) {
            console.error("Error adding image:", error);
            alert("Error adding image: " + error.message);
            setLoading(false);
            return;
        }

        setNewItem({ image_url: "", alt_text: "" });
        setIsAdding(false);
        fetchImages();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete?")) return;
        const { error } = await supabase.from("gallery_images").delete().eq("id", id);

        if (error) {
            console.error("Error deleting image:", error);
            alert("Error deleting image: " + error.message);
            return;
        }

        fetchImages();
    };

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto pb-32">
            <div className="flex items-center justify-between mb-12 sticky top-0 bg-[#050505]/80 backdrop-blur-xl py-4 z-40 -mx-4 px-4 md:mx-0 md:px-0">
                <Link href="/admin" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden md:inline">Back</span>
                </Link>
                <div className="flex gap-2">
                    <button onClick={saveOrder} className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all">Save Order</button>
                    <button onClick={() => setIsAdding(true)} className="px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all">Add Image</button>
                </div>
            </div>

            <h1 className="text-3xl font-medium text-white mb-2">Hero Gallery</h1>
            <p className="text-white/40 text-sm mb-8">Manage the vertical stack images.</p>

            <Reorder.Group axis="y" values={images} onReorder={handleReorder} className="space-y-4">
                {images.map((img) => (
                    <Reorder.Item key={img.id} value={img} className="bg-[#111] border border-white/5 rounded-xl p-4 flex items-center gap-6 group hover:border-white/10 transition-colors cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-5 h-5 text-white/20" />
                        <div className="w-16 h-24 bg-black/50 rounded-lg overflow-hidden flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{img.alt_text || "No Alt Text"}</p>
                            <p className="text-white/30 text-xs font-mono truncate">{img.image_url}</p>
                        </div>
                        <button onClick={() => handleDelete(img.id)} className="p-3 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md bg-[#161616] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-4">
                        <h2 className="text-xl font-medium text-white mb-4">Add Gallery Image</h2>
                        <input
                            value={newItem.image_url}
                            onChange={e => setNewItem({ ...newItem, image_url: e.target.value })}
                            className="w-full bg-[#111] border border-white/5 rounded-xl p-3 text-white text-sm"
                            placeholder="Image URL..."
                        />
                        <input
                            value={newItem.alt_text}
                            onChange={e => setNewItem({ ...newItem, alt_text: e.target.value })}
                            className="w-full bg-[#111] border border-white/5 rounded-xl p-3 text-white text-sm"
                            placeholder="Alt Text..."
                        />
                        <button onClick={handleAdd} className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90">Add Image</button>
                    </div>
                </div>
            )}
        </div>
    );
}
