import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { WorksClient } from "./client";

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
