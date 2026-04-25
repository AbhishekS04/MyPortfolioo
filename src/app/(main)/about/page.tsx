import { Metadata } from "next";
import { AboutClient } from "@/components/about/about-client";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Abhishek Singh, a Product Engineer focused on interaction design and building premium web experiences.",
  openGraph: {
    title: "About | Abhishek Singh",
    description:
      "Learn more about Abhishek Singh, a Product Engineer focused on interaction design and building premium web experiences.",
    url: "https://abhisheksingh.tech/about",
    siteName: "Abhishek Singh Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Abhishek Singh",
    description:
      "Learn more about Abhishek Singh, a Product Engineer focused on interaction design and building premium web experiences.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://abhisheksingh.tech/about",
  },
};

export default function AboutPage() {
  // Static Data - Editable via Code
  const general = {
    full_name: "Abhishek Singh",
    role_title: "Product Engineer",
    bio_description:
      "My name is Abhishek Singh, a self-taught Product Engineer with 2+ years of experience creating modern, clean, and minimal digital experiences that make a lasting impression.",
    availability_status: "Available",
    is_available: true,
    contact_email: "Abhishek23main@gmail.com",
    phone_number: "+91 9883511660",
    location: "Kolkata, India",
    birthday: "2004-10-23",
    profile_image_url:
      // "https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/68e0efce-84a4-42ae-9bd7-a2be6aca73d8.jpg",
      "https://cloud-snapp.vercel.app/api/cdn/c61a41dc-b994-4528-aa43-36a05d3f8f91?w=2000&fmt=webp",
  };

  const experience = [
    {
      id: "1",
      role: "Freelance Designer & Dev",
      company: "Self-Employed",
      period: "2024 - Present",
      description_points: [
        "Worked on diverse UI system and brand identity projects.",
        "Collaborated with clients from multiple countries.",
        "Developed a versatile design skill set.",
      ],
    },
    {
      id: "2",
      role: "Product Designer",
      company: "Meetzed",
      period: "2020 - 2021",
      description_points: [
        "Collaboration: Supported Lead Designer on projects.",
        "Branding: Crafted unique brand identities.",
        "Tools: Worked on design systems and prototypes.",
      ],
    },
  ];

  const education = [
    {
      id: "1",
      degree: "Graduation",
      institution: "Adamas University",
      year: "2023 - 2027",
    },
    {
      id: "2",
      degree: "Higher Secondary",
      institution: "Rampurhat JL Vidyabhaban",
      year: "2022 - 2023",
    },
    {
      id: "3",
      degree: "Secondary Education",
      institution: "Rampurhat JL Vidyabhaban",
      year: "2020 - 2021",
    },
  ];

  const interests = [
    { id: "1", label: "Gaming", icon_name: "Gamepad2" },
    { id: "2", label: "Film Making", icon_name: "Film" },
    { id: "3", label: "Traveling", icon_name: "Plane" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 relative overflow-x-hidden">
      <AboutClient
        general={general}
        experience={experience}
        education={education}
        interests={interests}
      />
    </main>
  );
}
