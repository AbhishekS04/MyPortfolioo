
export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    image: string; // URL for now
    link: string;
}

export const FEATURED_PROJECTS: Project[] = [
    {
        id: "1",
        title: "Lumina Interface",
        description: "A next-gen dashboard for light analytics.",
        techStack: ["Next.js", "WebGL", "Tailwind"],
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
        link: "/works/lumina",
    },
    {
        id: "2",
        title: "Apex Finance",
        description: "Real-time trading platform with sub-ms latency.",
        techStack: ["React", "Rust", "WebSockets"],
        image: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2576&auto=format&fit=crop",
        link: "/works/apex",
    },
    {
        id: "3",
        title: "Vocalize AI",
        description: "Voice synthesis engine for web applications.",
        techStack: ["Python", "TensorFlow", "React"],
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2664&auto=format&fit=crop",
        link: "/works/vocalize",
    },
    {
        id: "4",
        title: "Orbit Design System",
        description: "A comprehensive design language for enterprise.",
        techStack: ["Figma", "Storybook", "React"],
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        link: "/works/orbit",
    },
];

export const SKILLS = [
    "Frontend Engineering",
    "UI Systems & Animations",
    "Next.js & React Architecture",
    "AI-assisted Development",
];

export const WHY_I_BUILD = {
    primary: "I enjoy turning complex ideas into clean, usable systems.",
    secondary: "I focus on clarity, performance, and scalability rather than visual noise.",
};
