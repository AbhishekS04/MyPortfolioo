"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Story {
  id: string;
  platform: string;
  media_url: string;
  link_url: string;
  caption: string;
  display_order: number;
}

export default function AdminStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Story>>({});
  const supabase = createClient();

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from("social_stories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching stories:", error.message);
    }

    if (data) setStories(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = (story: Story) => {
    setEditingId(story.id);
    setFormData(story);
  };

  const handleCreate = () => {
    setEditingId("new");
    setFormData({
      platform: "instagram",
      media_url: "",
      link_url: "",
      caption: "",
      display_order: stories.length + 1,
    });
  };

  const handleSave = async () => {
    if (!formData.media_url) return alert("Image URL required");

    setLoading(true);
    if (editingId === "new") {
      const { error } = await supabase
        .from("social_stories")
        .insert([formData]);
      if (error) {
        console.error("Error inserting story:", error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("social_stories")
        .update(formData)
        .eq("id", editingId);
      if (error) {
        console.error("Error updating story:", error.message);
        setLoading(false);
        return;
      }
    }
    setEditingId(null);
    fetchStories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    await supabase.from("social_stories").delete().eq("id", id);
    fetchStories();
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 sticky top-0 bg-[#050505]/80 backdrop-blur-xl py-4 z-40 -mx-4 px-4 md:mx-0 md:px-0">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden md:inline">Back to Dashboard</span>
        </Link>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Story</span>
        </button>
      </div>

      <h1 className="text-3xl font-medium text-white mb-2">Social Stories</h1>
      <p className="text-white/40 text-sm mb-8">
        Manage the stories that appear in the navbar ring.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-colors"
          >
            <div className="relative aspect-[9/16] bg-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.media_url}
                alt={`${story.platform} story${story.caption ? " – " + story.caption : ""}`}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
              />

              <div className="absolute top-2 right-2 flex gap-2">
                <span className="px-2 py-1 rounded bg-black/50 backdrop-blur text-[10px] text-white font-medium uppercase">
                  {story.platform}
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-white/80 text-sm font-medium truncate mb-1">
                {story.caption || "No caption"}
              </p>
              <p className="text-white/40 text-xs truncate font-mono mb-4">
                {story.link_url}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(story)}
                  className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(story.id)}
                  className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              onClick={() => setEditingId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-lg bg-[#161616] border border-white/10 rounded-[32px] p-8 shadow-2xl"
            >
              <h2 className="text-xl font-medium text-white mb-6">
                {editingId === "new" ? "New Story" : "Edit Story"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-white/40 uppercase tracking-widest block mb-2">
                    Platform
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                    className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-white/40 uppercase tracking-widest block mb-2">
                    Media URL (Portrait Image)
                  </label>
                  <input
                    value={formData.media_url}
                    onChange={(e) =>
                      setFormData({ ...formData, media_url: e.target.value })
                    }
                    className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 font-mono text-xs"
                    placeholder="https://..."
                  />
                  {formData.media_url && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-white/10 relative aspect-[9/16] w-32 mx-auto bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.media_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[10px] text-white/50 bg-black/50 px-2 py-1 rounded">
                          Preview
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-white/40 uppercase tracking-widest block mb-2">
                    Link Destination
                  </label>
                  <input
                    value={formData.link_url}
                    onChange={(e) =>
                      setFormData({ ...formData, link_url: e.target.value })
                    }
                    className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 font-mono text-xs"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-white/40 uppercase tracking-widest block mb-2">
                    Caption
                  </label>
                  <input
                    value={formData.caption}
                    onChange={(e) =>
                      setFormData({ ...formData, caption: e.target.value })
                    }
                    className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20"
                    placeholder="Story caption..."
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-medium mt-4 hover:bg-white/90"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Save Story"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
