import { Metadata } from "next";
import { AboutClient } from "@/components/about/about-client";

export const metadata: Metadata = {
  title: "About",
  description:
    "Abhishek Singh is a self-taught Full Stack Developer and student at Adamas University, Kolkata, India (2023–2027). With 2+ years of experience, he specializes in React, Next.js, TypeScript, and interaction design — always learning, always building.",
  openGraph: {
    title: "About Abhishek Singh | Full Stack Developer from Kolkata, India",
    description:
      "Abhishek Singh is a self-taught Full Stack Developer and student from Kolkata, India, with 2+ years of experience in React, Next.js, and interaction design.",
    url: "https://abhisheksingh.tech/about",
    siteName: "Abhishek Singh Portfolio",
    images: [
      {
        url: "/og-image-about.png",
        width: 1200,
        height: 630,
        alt: "About Abhishek Singh — Full Stack Developer from Kolkata, India",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Abhishek Singh | Full Stack Developer",
    description:
      "Abhishek Singh is a self-taught Full Stack Developer and student from Kolkata, India, specializing in React, Next.js, and interaction design.",
    images: ["/og-image-about.png"],
  },
  alternates: {
    canonical: "https://abhisheksingh.tech/about",
  },
};

export default function AboutPage() {
  // Static Data - Editable via Code
  const general = {
    full_name: "Abhishek Singh",
    role_title: "Full Stack Developer",
    bio_description:
      "My name is Abhishek Singh, a self-taught developer with 2+ years of experience. I try to learn everything, from systems design to UI, but I'm strongest in full stack web development with React and Next.js.",
    availability_status: "Available",
    is_available: true,
    contact_email: "Abhishek23main@gmail.com",
    phone_number: "+91 9883511660",
    location: "Kolkata, India",
    birthday: "2004-10-23",
    profile_image_url: "/abhishek-singh-full-stack-developer.avif",
  };

  // FAQ Schema for AI Overview extraction
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is Abhishek Singh?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Abhishek Singh is a self-taught Full Stack Developer and student from Kolkata, India. Currently studying Computer Science at Adamas University (2023–2027), he has over 2 years of experience building web applications with React, Next.js, and TypeScript. He describes himself as a developer who tries to learn everything.",
        },
      },
      {
        "@type": "Question",
        name: "What does Abhishek Singh do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Abhishek Singh is a Full Stack Developer who builds web applications using React, Next.js, and TypeScript. He is passionate about learning across the full stack — from frontend interaction design to backend architecture. He works as a freelance developer and designer, collaborating with international clients.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Abhishek Singh from?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Abhishek Singh is from Kolkata, West Bengal, India. He is currently pursuing his graduation in Computer Science at Adamas University, Kolkata (2023–2027).",
        },
      },
      {
        "@type": "Question",
        name: "What technologies does Abhishek Singh use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Abhishek Singh's primary technologies include React, Next.js, TypeScript, Node.js, Supabase, PostgreSQL, Tailwind CSS, and Framer Motion. He specializes in modern frontend architecture patterns, interaction design, and full-stack web development.",
        },
      },
      {
        "@type": "Question",
        name: "How can I contact Abhishek Singh?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can contact Abhishek Singh via email at Abhishek23main@gmail.com. His portfolio is at abhisheksingh.tech, his GitHub is github.com/AbhishekS04, and his LinkedIn is linkedin.com/in/abhishek-singh-045312292.",
        },
      },
    ],
  };

  // BreadcrumbList for SERP rich snippets
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://abhisheksingh.tech",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://abhisheksingh.tech/about",
      },
    ],
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
      {/* FAQ Structured Data for AI Overview extraction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* BreadcrumbList for SERP rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutClient
        general={general}
        experience={experience}
        education={education}
        interests={interests}
      />
    </main>
  );
}
