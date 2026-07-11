"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import {
  Gamepad2,
  Mail,
  Phone,
  MapPin,
  User,
  ExternalLink,
} from "lucide-react";
import { RatingInteraction } from "@/components/ui/emoji-rating";
import FisheyeShader from "@/components/ui/fisheye-shader";
import dynamic from "next/dynamic";

const RealMap = dynamic(() => import("@/components/ui/real-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#111] animate-pulse rounded-[32px]" />
  ),
});

const fisheyeSettings = {
  fisheyeStrength: 2.2,
  vignetteStart: 0.3,
  vignetteEnd: 1.5,
  fisheyeRadius: 1.2,
  chromaticAberration: 0.005,
  noiseIntensity: 0.08,
  vignetteIntensity: 0.1,
  animationDuration: 0.4,
  canvasOpacity: 1.0,
  showVignetteMask: false,
};

const BentoCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <m.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`bg-[#111] border border-white/5 rounded-[32px] overflow-hidden ${className}`}
  >
    {children}
  </m.div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
    {children}
  </span>
);

interface GeneralData {
  profile_image_url?: string;
  full_name: string;
  role_title: string;
  bio_description: string;
  is_available: boolean;
  availability_status: string;
  birthday?: string;
  contact_email: string;
  phone_number?: string;
  location?: string;
}

interface ExperienceData {
  id: string;
  role: string;
  company: string;
  period: string;
  description_points?: string[];
}

interface EducationData {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface InterestData {
  label: string;
  icon_name: string;
}

export function AboutClient({
  general,
  experience,
  education,
  interests,
}: {
  general: GeneralData;
  experience: ExperienceData[];
  education: EducationData[];
  interests: InterestData[];
}) {
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    if (general.birthday) {
      const timer = setTimeout(() => {
        setAge(
          Math.floor(
            (Date.now() - new Date(general.birthday!).getTime()) / 31557600000,
          ),
        );
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [general.birthday]);

  // Helper to dynamic icon
  const getIcon = (name: string) => {
    const Icon = (
      LucideIcons as unknown as Record<
        string,
        React.ComponentType<{ size?: number }>
      >
    )[name];
    return Icon ? <Icon size={16} /> : <Gamepad2 size={16} />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 px-4 md:px-8 lg:px-12 pt-24 md:pt-32 pb-20">
      {/* --- Top Row: Profile & Bio --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        <BentoCard className="md:col-span-4 h-[320px] relative group overflow-hidden">
          <FisheyeShader
            src={
              general.profile_image_url ||
              "/abhishek-singh-full-stack-developer.avif"
            }
            settings={fisheyeSettings}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* SEO crawler fallback image for WebGL canvas */}
          <img
            src={
              general.profile_image_url ||
              "/abhishek-singh-full-stack-developer.avif"
            }
            alt="Abhishek Singh — Full Stack Developer Profile Portrait"
            className="sr-only"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
            <h1 className="text-xl md:text-2xl font-bold">
              {general.full_name}
            </h1>
            <p className="text-white/40 text-sm italic">{general.role_title}</p>
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-8 p-5 md:p-8 flex flex-col justify-center">
          <p className="text-lg md:text-2xl font-medium leading-relaxed text-white/90 whitespace-pre-line">
            {general.bio_description}
          </p>
          <div className="mt-6 md:mt-8 flex flex-wrap gap-2 md:gap-3">
            {/* <Badge>Founder</Badge> */}
            <Badge>Full Stack Dev</Badge>
            <Badge>React &amp; Next.js</Badge>
            <Badge>Always Learning</Badge>
            <Badge>Open to Work</Badge>
          </div>
        </BentoCard>
      </div>

      {/* --- Interests Row --- */}
      <BentoCard className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <span className="text-lg font-semibold border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 flex items-center gap-2 w-full md:w-auto">
            Interests
          </span>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {interests.map((item, idx) => {
              const isGaming = item.label === "Gaming";
              const content = (
                <>
                  {getIcon(item.icon_name)}
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              );
              const itemClassName = `
                                flex items-center gap-2 px-3 md:px-4 py-2 rounded-2xl border transition-all duration-300
                                ${
                                  isGaming
                                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400 cursor-pointer hover:bg-emerald-500/10 hover:scale-105"
                                    : "bg-white/[0.03] border-white/5 text-white/60"
                                }
                            `;

              if (isGaming) {
                return (
                  <Link key={idx} href="/gaming" className={itemClassName}>
                    {content}
                  </Link>
                );
              }

              return (
                <div key={idx} className={itemClassName}>
                  {content}
                </div>
              );
            })}
            {interests.length === 0 && (
              <span className="text-sm text-white/20">
                No interests added yet.
              </span>
            )}
          </div>
        </div>
      </BentoCard>

      {/* --- Experience & Education Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Experience Cards */}
        {experience.map((exp) => (
          <BentoCard key={exp.id} className="p-5 md:p-8 space-y-4 md:space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl md:text-2xl font-bold">{exp.role}</h3>
                <p className="text-white/40 text-sm">{exp.company}</p>
              </div>
              <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded-md whitespace-nowrap ml-2">
                {exp.period}
              </span>
            </div>
            <div className="w-full h-px bg-white/5" />
            <ul className="space-y-3 md:space-y-4 text-sm text-white/60">
              {exp.description_points?.map((pt: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <span className="text-white/20">•</span>
                  {pt}
                </li>
              ))}
            </ul>
          </BentoCard>
        ))}

        {/* Education Card */}
        <BentoCard className="p-5 flex flex-col justify-start h-full">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold">Education</h2>
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40">
              <LucideIcons.GraduationCap size={16} />
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-5 mt-auto">
            {education.map((edu, idx) => {
              const isCurrent = idx === 0; // Highlight the latest education as 'currently pursuing'
              return (
                <div
                  key={edu.id}
                  className={`group/edu flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4 border-b border-white/[0.03] pb-4 last:border-0 last:pb-0 transition-all duration-300 ${isCurrent ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                >
                  <div className="space-y-1.5 sm:max-w-[70%]">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm md:text-base font-bold text-white/90 leading-snug">
                        {edu.degree}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        {isCurrent ? (
                          <div
                            className="flex items-center gap-1.5"
                            title="Currently Pursuing"
                          >
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                            </span>
                            <span className="text-[9px] uppercase font-bold text-blue-400 tracking-wider">
                              Pursuing
                            </span>
                          </div>
                        ) : (
                          <div
                            className="flex items-center gap-1.5"
                            title="Completed"
                          >
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider">
                              Completed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-white/40 flex items-center gap-2">
                      {edu.institution}
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0 mt-1 sm:mt-0">
                    <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-white/5 border border-white/10 rounded-md whitespace-nowrap ml-2">
                      {edu.year}
                    </span>
                  </div>
                </div>
              );
            })}
            {education.length === 0 && (
              <p className="text-xs text-white/40">No education added.</p>
            )}
          </div>
        </BentoCard>
      </div>

      {/* --- Portfolio Row --- */}
      <BentoCard className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <span className="text-lg font-bold border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-8 w-full md:w-auto">
            Portfolio
          </span>
          <div className="flex flex-wrap gap-4 md:gap-6 text-sm font-medium text-white/40">
            <a
              href="https://github.com/AbhishekS04"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <span>GitHub</span> <ExternalLink size={14} />
            </a>
            <a
              href="https://x.com/_abhishek2304"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <span>Twitter</span> <ExternalLink size={14} />
            </a>
            <a
              href="https://instagram.com/abhi3hekk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <span>Instagram</span> <ExternalLink size={14} />
            </a>
            <a
              href="https://www.linkedin.com/in/abhishek-singh-045312292"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <span>LinkedIn</span> <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </BentoCard>

      {/* --- Availability & Feedback Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Location Map Block (Replaces Availability Text) */}
        <BentoCard className="relative p-0 md:p-0 overflow-hidden group min-h-[300px]">
          <RealMap />
        </BentoCard>

        {/* Quick Feedback (Rating) Block */}
        <BentoCard className="p-5 md:p-8 flex flex-col items-center justify-center text-center max-h-[300px] md:max-h-none">
          <RatingInteraction />
        </BentoCard>
      </div>

      {/* --- Footer / Details --- */}
      <BentoCard className="p-5 md:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-[0.8fr_1.3fr_1fr_1fr] gap-6 md:gap-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
              <User size={16} className="md:w-[18px] md:h-[18px]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                Age
              </p>
              <p className="text-xs md:text-sm font-medium">
                {general.birthday
                  ? age !== null
                    ? `${age} Years`
                    : "Loading..."
                  : "21 Years"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-3 md:gap-4 group cursor-pointer text-left"
            onClick={() =>
              (window.location.href = `mailto:${general.contact_email}`)
            }
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white/10 transition-colors">
              <Mail size={16} className="md:w-[18px] md:h-[18px]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                Email
              </p>
              <p className="text-xs md:text-sm font-medium break-all">
                {general.contact_email}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
              <Phone size={16} className="md:w-[18px] md:h-[18px]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                Phone
              </p>
              <p className="text-xs md:text-sm font-medium">
                {general.phone_number || "+91 0000000000"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
              <MapPin size={16} className="md:w-[18px] md:h-[18px]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                Location
              </p>
              <p className="text-xs md:text-sm font-medium">
                {general.location || "Kolkata, India"}
              </p>
            </div>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
