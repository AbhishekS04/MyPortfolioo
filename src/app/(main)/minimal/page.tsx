"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiSupabase,
  SiNodedotjs,
  SiFramer,
  SiPostgresql,
} from "react-icons/si";

// Types
interface HelperProject {
  id: string;
  title: string;
  description: string;
  tech_stack: string[]; // Supabase returns this
  slug: string;
  image_url: string;
  link?: string; // Optional if we construct it
}

export default function MinimalPage() {
  const [projects, setProjects] = useState<HelperProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Suppress only specific Ctrl combos that may conflict with the page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere when user is typing in an input/textarea/contentEditable
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return;
      }
      // Intercept only Ctrl+S and Ctrl+P to prevent browser save/print dialogs
      if (e.ctrlKey && ["s", "p"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("featured", true)
          .order("display_order", { ascending: true });

        if (error) throw error;
        if (data) {
          setProjects(data as HelperProject[]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-[#e1e1e1] font-sans selection:bg-white/20 pb-32">
      {/* 
              This page intentionally uses a constrained width and simple stacking 
              to ensure "super responsiveness" and high readability.
            */}
      <div className="max-w-4xl mx-auto px-6 pt-32 md:pt-48">
        {/* --- Header / Bio Section --- */}
        <header className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-12 md:gap-24 items-start">
            {/* Left Column: Bio & Info */}
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-white/10 overflow-hidden relative border border-white/5 shadow-2xl">
                  <Image
                    //! supabase shitttt
                    // src="https://rdxqqgntmtzvqsmepmls.supabase.co/storage/v1/object/public/assets/original/68e0efce-84a4-42ae-9bd7-a2be6aca73d8.jpg"
                    //! old clodsnapp urllll
                    // src="https://cloud-snapp.vercel.app/api/cdn/c61a41dc-b994-4528-aa43-36a05d3f8f91?w=2000&fmt=webp"
                    //! current clodsnapp url
                    src="/abhishek-singh-full-stack-developer.avif"
                    alt="Abhishek Singh — Full Stack Developer"
                    fill
                    sizes="(max-width: 768px) 80px, 80px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
                    Abhishek
                  </h1>
                  <p className="text-white/40 font-mono text-sm tracking-wide">
                    Singular Focus. Global Reach.
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-lg md:text-xl leading-relaxed text-white/80 font-light">
                <p>
                  I&apos;m a{" "}
                  <span className="text-white font-medium">
                    self-taught developer
                  </span>{" "}
                  who tries to learn everything — strongest in{" "}
                  <span className="text-white font-medium">
                    full stack web development
                  </span>
                  .
                </p>
                <p className="text-white/60 text-base">
                  I craft digital experiences with a focus on precision, motion,
                  and minimal aesthetics. My work bridges the gap between
                  functional engineering and artistic design.
                </p>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-white/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Available
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  India
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 font-medium"
                >
                  <span className="border-b border-white/20 pb-0.5 hover:border-white transition-colors">
                    Resume
                  </span>{" "}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Tech Stack & Details */}
            <div className="space-y-12 pt-4">
              {/* Tech Stack */}
              <div className="space-y-6">
                <h2 className="text-xs font-mono text-white/30 uppercase tracking-widest">
                  Core Stack
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {[
                    { name: "Next.js", icon: SiNextdotjs },
                    { name: "React", icon: SiReact },
                    { name: "TypeScript", icon: SiTypescript },
                    { name: "Tailwind", icon: SiTailwindcss },
                    { name: "Supabase", icon: SiSupabase },
                    { name: "Node.js", icon: SiNodedotjs },
                    { name: "Framer", icon: SiFramer },
                    { name: "PostgreSQL", icon: SiPostgresql },
                  ].map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300"
                    >
                      <tech.icon className="w-5 h-5 opacity-80" />
                      <span className="text-sm">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Areas or other details per user request? 
                                "clearly defining my text tags about me... what I do... where I am from" - Covered.
                            */}
            </div>
          </div>
        </header>

        <hr className="border-white/5 mb-24" />

        {/* --- Works Section --- */}
        <section className="space-y-16">
          <div className="flex items-end justify-between">
            <h2 className="text-xs font-mono text-white/30 uppercase tracking-widest">
              Selected Works
            </h2>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-white/30 text-sm animate-pulse">
                Loading works...
              </div>
            ) : projects.length === 0 ? (
              <div className="text-white/30 text-sm">No projects found.</div>
            ) : (
              <>
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/works/${project.slug}?from=minimal`}
                    className="group block relative p-6 -mx-6 rounded-2xl hover:bg-white/5 transition-colors duration-300"
                  >
                    <article className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-medium text-white/90 group-hover:text-white transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors line-clamp-1 max-w-md">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-wrap gap-2 justify-end max-w-[200px]">
                          {project.tech_stack?.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] uppercase tracking-wider text-white/30 font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                      </div>
                    </article>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Show All Button */}
          {!isLoading && projects.length > 0 && (
            <div className="pt-8 flex justify-center sm:justify-start">
              <Link
                href="/works?from=minimal"
                className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group"
              >
                <span>Show All Projects</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          )}
        </section>

        {/* --- Footer / Contact --- */}
        <footer className="mt-32 pb-12 border-t border-white/5 pt-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-mono text-white/30 uppercase tracking-widest">
              Connect
            </h2>
            <div className="flex gap-6 text-sm">
              <a
                href="mailto:abhishek23main@gmail.com"
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
              <a
                href="https://github.com/abhisheks04"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>

          <div className="mt-12 text-xs text-white/20">
            © {new Date().getFullYear()} Abhishek Singh. All rights reserved.
          </div>
        </footer>
      </div>
    </main>
  );
}
