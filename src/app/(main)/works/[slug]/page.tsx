import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { ProjectDetailsView } from "@/components/works/project-details-view";
import { Metadata } from "next";

export const revalidate = 0; // Dynamic rendering

interface WorksDetailProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getProject(slug: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

    return data;
}

export async function generateMetadata({ params }: WorksDetailProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) return { title: "Project Not Found" };
    return {
        title: `${project.title} - Case Study`,
        description: project.description,
    };
}

export default async function ProjectDetailPage({ params }: WorksDetailProps) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    if (project.is_coming_soon) {
        redirect('/works');
    }

    const { data: contributors } = await (await createClient())
        .from("project_contributors")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: true });

    return (
        <Suspense fallback={null}>
            <ProjectDetailsView project={project} contributors={contributors || []} />
        </Suspense>
    );
}
