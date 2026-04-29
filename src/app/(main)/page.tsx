import { Metadata } from "next";
import { BentoGallery } from "@/components/home/bento-gallery";
import { getGalleryImages, getFeaturedProjects } from "@/app/actions/gallery";
import { LazyHomeContent } from "@/components/home/lazy-home-content";

import { ConsciousnessMode } from "@/components/ui/consciousness-mode";
import { ClipboardSecret } from "@/components/ui/clipboard-secret";
import { ExitMessage } from "@/components/ui/exit-message";

// Revalidate every 60 seconds so admin panel updates appear without a full rebuild
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Abhishek Singh | Portfolio",
  description:
    "Abhishek Singh is a self-taught Full Stack Developer and CS student at Adamas University, Kolkata, India (2023–2027). 2+ years of experience building production web apps with React, Next.js, TypeScript, and Supabase.",
  openGraph: {
    title: "Abhishek Singh | Full Stack Developer & Portfolio",
    description:
      "Personal portfolio of Abhishek Singh — building with React, Next.js, and TypeScript.",
    url: "https://abhisheksingh.tech",
    images: [
      {
        url: "https://cloud-snapp.vercel.app/api/cdn/c61a41dc-b994-4528-aa43-36a05d3f8f91?fmt=avif",
        width: 1200,
        height: 630,
        alt: "Abhishek Singh | Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://cloud-snapp.vercel.app/api/cdn/c61a41dc-b994-4528-aa43-36a05d3f8f91?fmt=avif",
    ],
  },
};

export default async function Home() {
  // Fetch data on server - instant availability
  const [galleryImages, featuredProjects] = await Promise.all([
    getGalleryImages(),
    getFeaturedProjects(),
  ]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20 relative overflow-x-hidden">
      {/* Visually hidden elements for SEO & AI LLM Extraction */}
      <h1 className="sr-only">Abhishek Singh — Full Stack Developer</h1>
      <div className="sr-only">
        <p>
          Abhishek Singh is a self-taught Full Stack Developer and student from
          Kolkata, India. He is currently pursuing a degree in Computer Science
          at Adamas University, Kolkata (2023–2027). With over 2 years of
          experience, he describes himself as a developer who tries to learn
          everything — from frontend design to backend systems.
        </p>
        <p>
          His strongest areas are full stack web development with React,
          Next.js, and TypeScript. He also works extensively with Node.js,
          Supabase, PostgreSQL, Tailwind CSS, and Framer Motion. He has
          collaborated with international clients on UI systems, brand
          identities, and full-stack web applications since 2024.
        </p>
        <p>Contact Abhishek Singh at Abhishek23main@gmail.com.</p>
        {/* rel="me" links — tells Google/search engines these profiles all belong to the same person */}
        <ul>
          <li>
            <a
              href="https://github.com/AbhishekS04"
              rel="me noopener noreferrer"
            >
              GitHub: github.com/AbhishekS04
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/abhishek-singh-045312292"
              rel="me noopener noreferrer"
            >
              LinkedIn: Abhishek Singh
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/abhi3hekk/"
              rel="me noopener noreferrer"
            >
              Instagram: @abhi3hekk
            </a>
          </li>
          <li>
            <a href="https://x.com/_abhishek2304" rel="me noopener noreferrer">
              X / Twitter: @_abhishek2304
            </a>
          </li>
        </ul>
      </div>
      <ExitMessage />
      <ClipboardSecret />
      <ConsciousnessMode />
      <div className="relative z-0">
        {/* --- Hero Section (Eager Load) --- */}
        {/* Centers content on Desktop but allows scrolling if screen is too small */}
        <div className="lg:min-h-screen flex flex-col pt-24 md:pt-28 lg:pt-0 pb-6 px-4 md:px-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)]">
          {/* Optical Spacer for Navbar balance on Desktop */}
          <div className="hidden lg:block h-16 shrink-0" />

          <div className="flex-1 flex flex-col justify-center">
            <BentoGallery galleryImages={galleryImages} />
          </div>
        </div>

        {/* --- Below-the-fold content --- */}
        <LazyHomeContent featuredProjects={featuredProjects} />
      </div>
    </main>
  );
}
