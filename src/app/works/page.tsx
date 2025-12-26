import { createClient } from "@/utils/supabase/server";
import { WorksClient } from "./client";
import { NavBar } from "@/components/ui/navbar";

export const metadata = {
    title: "Works | Abhishek Singh",
    description: "A curated list of my projects and current work in progress.",
};

export default async function WorksPage() {
    const supabase = await createClient();

    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

    return (
        <>
            <NavBar />
            <WorksClient projects={projects || []} />
        </>
    );
}
