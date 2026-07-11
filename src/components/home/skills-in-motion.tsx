"use client";

import { m } from "framer-motion";
import { SKILLS, WHY_I_BUILD } from "@/lib/data";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function SkillsInMotion() {
  const [skills, setSkills] = useState<string[]>(SKILLS);
  const [profile, setProfile] = useState(WHY_I_BUILD);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Skills
        const { data: skillsData } = await supabase
          .from("skills")
          .select("name")
          .order("display_order", { ascending: true });

        if (skillsData && skillsData.length > 0) {
          setSkills(skillsData.map((s: { name: string }) => s.name));
        }

        // Fetch Profile
        const { data: profileData } = await supabase
          .from("profile")
          .select("bio_primary, bio_secondary")
          .limit(1)
          .single();

        if (profileData) {
          setProfile({
            primary: profileData.bio_primary,
            secondary: profileData.bio_secondary || "",
          });
        }
      } catch (error) {
        console.error("Error fetching skills/profile:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <section id="skills-in-motion" className="py-20">
      <div className="flex items-center justify-between mb-12 px-2">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-medium text-white/90">
          Thinking + Skills
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Skills in Motion */}
        <m.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-[#111111] border border-white/5 rounded-[32px] p-8 md:p-10 flex flex-col justify-between min-h-[300px]"
        >
          <div>
            <h3 className="text-xl font-medium text-white mb-6">
              Skills in Motion
            </h3>
            <ul className="space-y-3">
              {skills.map((skill, index) => (
                <li
                  key={index}
                  className="text-base md:text-lg text-white/60 font-light border-l border-white/10 pl-4 hover:border-white/50 hover:text-white/90 transition-all duration-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 text-xs text-white/20 uppercase tracking-widest">
            Constantly evolving
          </div>
        </m.div>

        {/* Card 2: Why I Build */}
        <m.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#111111] border border-white/5 rounded-[32px] p-8 md:p-10 flex flex-col justify-center relative overflow-hidden group min-h-[300px]"
        >
          {/* Subtle background gradient/glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700"></div>

          <div className="relative z-10">
            <h3 className="text-2xl font-medium text-white mb-8">
              Why I Build
            </h3>

            <p className="text-xl md:text-3xl font-medium text-white leading-tight mb-6">
              &quot;{profile.primary}&quot;
            </p>
            <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-md">
              {profile.secondary}
            </p>
          </div>
        </m.div>
      </div>
    </section>
  );
}
