import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { WorksClient } from "./client";

export const metadata: Metadata = {
    title: "Works",
    description: "A curated list of my projects and current work in progress.",
};

export default async function WorksPage() {
    const supabase = await createClient();

    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("is_hidden", false)
        .order("display_order", { ascending: true });

    return (
        <>
            <WorksClient projects={projects || []} />
        </>
    );
}
