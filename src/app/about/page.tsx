import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NavBar } from "@/components/ui/navbar";
import { AboutClient } from "@/components/about/about-client";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
    const supabase = createClient(cookies());

    // Fetch all data in parallel
    const [genRes, expRes, eduRes, skiRes, intRes] = await Promise.all([
        supabase.from("about_general").select("*").single(),
        supabase.from("about_experience").select("*").order("display_order", { ascending: true }),
        supabase.from("about_education").select("*").order("display_order", { ascending: true }),
        supabase.from("about_skills").select("*").order("display_order", { ascending: true }),
        supabase.from("about_interests").select("*").order("display_order", { ascending: true })
    ]);

    // Default Fallbacks (Important for first load before seeding)
    const general = genRes.data || {
        full_name: "Abhishek Singh",
        role_title: "UI System Designer & Developer",
        bio_description: "My name is Abhishek Singh, a self-taught UI Designer & Frontend Engineer with 4+ years of experience creating modern, clean, and minimal digital experiences that make a lasting impression.",
        availability_status: "Available",
        is_available: true,
        contact_email: "Abhishek23main@gmail.com"
    };

    const experience = expRes.data || [];
    const education = eduRes.data || [];
    const skills = skiRes.data || [];
    const interests = intRes.data || [];

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 relative overflow-x-hidden">
            <NavBar />
            <AboutClient
                general={general}
                experience={experience}
                education={education}
                skills={skills}
                interests={interests}
            />
        </main>
    );
}
