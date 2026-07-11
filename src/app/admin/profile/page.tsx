"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Save, Loader2, Globe, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { useToast } from "@/components/ui/toast";

export default function AdminProfile() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    signature_text: "",
    location_city: "",
    location_country: "",
    location_timezone: "",
    focus_area_title: "",
    focus_area_text: "",
    bio_primary: "",
    bio_secondary: "",
    email: "",
    availability_status: "",
    resume_url: "",
  });
  const supabase = createClient();

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .single();
      if (error && error.code !== "PGRST116") throw error; // PGRST116 is no rows
      if (data) {
        setFormData({
          signature_text: data.signature_text || "",
          location_city: data.location_city || "",
          location_country: data.location_country || "",
          location_timezone: data.location_timezone || "",
          focus_area_title: data.focus_area_title || "",
          focus_area_text: data.focus_area_text || "",
          bio_primary: data.bio_primary || "",
          bio_secondary: data.bio_secondary || "",
          email: data.email || "",
          availability_status: data.availability_status || "Available",
          resume_url: data.resume_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upsert logic: we assume there represents 1 row. Using an ID would be safer but singleton usually works with limit 1 select.
      // For upsert, we need a conflict. Let's just update the first row we find, or insert if empty.
      // Actually, we should select the ID first.
      const { data: existing } = await supabase
        .from("profile")
        .select("id")
        .single();

      let error;
      if (existing) {
        const { error: err } = await supabase
          .from("profile")
          .update(formData)
          .eq("id", existing.id);
        error = err;
      } else {
        const { error: err } = await supabase
          .from("profile")
          .insert([formData]);
        error = err;
      }

      if (error) throw error;
      showToast("Profile updated successfully!", "success");
    } catch (error: unknown) {
      showToast("Error saving: " + (error instanceof Error ? error.message : String(error)), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-white/50" />
      </div>
    );

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto pb-32">
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
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Section: Global Identity */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-medium text-white">Global Identity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 bg-[#111] border border-white/5 rounded-[32px]">
            <InputField
              label="Signature Text"
              name="signature_text"
              value={formData.signature_text}
              onChange={handleFieldChange}
              placeholder="Abhishek"
            />
            <InputField
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleFieldChange}
              placeholder="hello@example.com"
            />
            <InputField
              label="Resume URL"
              name="resume_url"
              value={formData.resume_url}
              onChange={handleFieldChange}
              placeholder="/resume.pdf"
            />
            <InputField
              label="Availability Status"
              name="availability_status"
              value={formData.availability_status}
              onChange={handleFieldChange}
              placeholder="Available for work"
            />
          </div>
        </section>

        {/* Section: Location */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-medium text-white">
              Location Settings
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8 bg-[#111] border border-white/5 rounded-[32px]">
            <InputField
              label="City"
              name="location_city"
              value={formData.location_city}
              onChange={handleFieldChange}
              placeholder="Kolkata"
            />
            <InputField
              label="Country"
              name="location_country"
              value={formData.location_country}
              onChange={handleFieldChange}
              placeholder="India"
            />
            <InputField
              label="Timezone"
              name="location_timezone"
              value={formData.location_timezone}
              onChange={handleFieldChange}
              placeholder="IST"
            />
          </div>
        </section>

        {/* Section: Content */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-medium text-white">Content & Bio</h2>
          </div>
          <div className="space-y-6 p-6 md:p-8 bg-[#111] border border-white/5 rounded-[32px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Focus Area Title"
                name="focus_area_title"
                value={formData.focus_area_title}
                onChange={handleFieldChange}
              />
              <TextAreaField
                label="Focus Area Text"
                name="focus_area_text"
                value={formData.focus_area_text}
                onChange={handleFieldChange}
                rows={3}
              />
            </div>
            <div className="bg-white/5 h-[1px] my-4" />
            <TextAreaField
              label="Bio Primary (Large)"
              name="bio_primary"
              value={formData.bio_primary}
              onChange={handleFieldChange}
              rows={2}
            />
            <TextAreaField
              label="Bio Secondary (Small)"
              name="bio_secondary"
              value={formData.bio_secondary}
              onChange={handleFieldChange}
              rows={3}
            />
          </div>
        </section>
      </m.div>
    </div>
  );
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <label
      htmlFor={name}
      className="text-xs font-medium text-white/40 uppercase tracking-widest"
    >
      {label}
    </label>
    <input
      id={name}
      type={type}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all font-mono text-sm"
    />
  </div>
);

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  rows?: number;
}) => (
  <div className="space-y-2">
    <label
      htmlFor={name}
      className="text-xs font-medium text-white/40 uppercase tracking-widest"
    >
      {label}
    </label>
    <textarea
      id={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      rows={rows}
      className="w-full bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all font-mono text-sm resize-none"
    />
  </div>
);
