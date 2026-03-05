import { Metadata } from "next";
import { AboutClient } from "@/components/about/about-client";

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about Abhishek Singh, a Product Engineer focused on interaction design and building premium web experiences.",
};

export default function AboutPage() {
    // Static Data - Editable via Code
    const general = {
        full_name: "Abhishek Singh",
        role_title: "Product Engineer",
        bio_description: "My name is Abhishek Singh, a self-taught Product Engineer with 2+ years of experience creating modern, clean, and minimal digital experiences that make a lasting impression.",
        availability_status: "Available",
        is_available: true,
        contact_email: "Abhishek23main@gmail.com",
        phone_number: "+91 9883511660",
        location: "Kolkata, India",
        birthday: "2004-10-23",
        profile_image_url: "https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/68e0efce-84a4-42ae-9bd7-a2be6aca73d8.jpg"
    };

    const experience = [
        {
            id: "1",
            role: "Freelance Designer & Dev",
            company: "Self-Employed",
            period: "2021 - Present",
            description_points: [
                "Worked on diverse UI system and brand identity projects.",
                "Collaborated with clients from multiple countries.",
                "Developed a versatile design skill set."
            ]
        },
        {
            id: "2",
            role: "Product Designer",
            company: "Meetzed",
            period: "2020 - 2021",
            description_points: [
                "Collaboration: Supported Lead Designer on projects.",
                "Branding: Crafted unique brand identities.",
                "Tools: Worked on design systems and prototypes."
            ]
        }
    ];

    const education = [
        {
            id: "1",
            degree: "Graduation",
            institution: "Adamas University",
            year: "2023"
        },
        {
            id: "2",
            degree: "Higher Secondary",
            institution: "Rampurhat JL Vidyabhaban",
            year: "2023"
        },
        {
            id: "3",
            degree: "Secondary Education",
            institution: "Rampurhat JL Vidyabhaban",
            year: "2020"
        }
    ];

    const skills = [
        { id: "1", category: "design", name: "Figma", icon_name: "Fg", color_code: "#F24E1E" },
        { id: "2", category: "design", name: "Photoshop", icon_name: "Ps", color_code: "#31A8FF" },
        { id: "3", category: "design", name: "Illustrator", icon_name: "Ai", color_code: "#FF3366" },
        { id: "4", category: "editing", name: "After Effects", icon_name: "Ae", color_code: "#9999FF" },
        { id: "5", category: "editing", name: "Premiere Pro", icon_name: "Pr", color_code: "#FF66FF" }
    ];

    const interests = [
        { id: "1", label: "Gaming", icon_name: "Gamepad2" },
        { id: "2", label: "Film Making", icon_name: "Film" },
        { id: "3", label: "Traveling", icon_name: "Plane" }
    ];

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 relative overflow-x-hidden">
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
