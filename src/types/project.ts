export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    tech_stack: string[]; // Note: DB likely uses snake_case, ensure frontend aligns
    image_url: string;
    project_url: string;
    github_url?: string;
    status: 'Not Started' | 'In Progress' | 'Near Completion' | 'Completed' | string;
    is_currently_working?: boolean;
    created_at?: string;
    display_order?: number;
    is_coming_soon?: boolean;
}
