"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ComingSoonBadge } from "@/components/ui/coming-soon-badge";
import { Project } from "@/types/project";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1200px]">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">
            All Projects
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group relative block h-full">
                {(() => {
                  const cardContent = (
                    <div
                      className={`h-full bg-[#111] border border-white/5 rounded-[32px] overflow-hidden flex flex-col transition-all duration-300 ${!project.is_coming_soon ? "group-hover:border-white/10 hover:shadow-2xl hover:shadow-white/5" : ""}`}
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] w-full relative bg-black/50 overflow-hidden">
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={project.image_url?.includes(
                            "res.cloudinary.com",
                          )}
                          className={`object-cover transition-transform duration-500 ${!project.is_coming_soon ? "group-hover:scale-110 group-hover:opacity-100 opacity-80" : "opacity-60 blur-[2px]"}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />

                        {/* Hover Overlay Icon or Coming Soon */}
                        {project.is_coming_soon ? (
                          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-500">
                            <ComingSoonBadge />
                          </div>
                        ) : (
                          <div className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-md opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <ArrowUpRight className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3
                          className={`text-xl font-bold mb-2 transition-colors ${project.is_coming_soon ? "text-white/50" : "text-white group-hover:text-blue-200/90"}`}
                        >
                          {project.title}
                        </h3>
                        <p className="text-white/40 text-sm leading-relaxed mb-6 flex-1 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Footer / Tech */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex flex-wrap gap-2">
                            {project.tech_stack.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-[10px] uppercase font-medium tracking-wider text-white/30 px-2 py-1 bg-white/5 rounded border border-white/5"
                              >
                                {t}
                              </span>
                            ))}
                            {project.tech_stack.length > 3 && (
                              <span className="text-[10px] text-white/20">
                                +{project.tech_stack.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                  if (project.is_coming_soon) {
                    return (
                      <div className="block h-full cursor-not-allowed select-none">
                        {cardContent}
                      </div>
                    );
                  }

                  return (
                    <Link
                      href={`/works/${project.slug || "#"}`}
                      className="block h-full"
                    >
                      {cardContent}
                    </Link>
                  );
                })()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
