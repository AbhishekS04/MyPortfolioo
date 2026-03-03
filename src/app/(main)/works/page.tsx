import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { WorksClient } from "./client";

// Revalidate every 60 seconds so admin panel updates appear without a full rebuild
export const revalidate = 60;

export const metadata: Metadata = {
    title: "Works",
    description: "A curated list of my projects and current work in progress.",
};

export default async function WorksPage() {
    const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_hidden", false)
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching projects:", error.message);
    }

    return (
        <>
            <WorksClient projects={projects || []} />
        </>
    );
}
