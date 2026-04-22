"use client";

import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink } from "lucide-react";
import { GitHubRepo } from "@/lib/github";
import Link from "next/link";

export function RepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        <div className="h-full bg-[#0d1117] border border-white/10 rounded-md p-4 flex flex-col justify-between transition-all duration-300 hover:border-white/30 group-hover:bg-[#161b22]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/40 hover:text-blue-400">
                {/* Repo Icon */}
                <svg
                  aria-hidden="true"
                  height="16"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="16"
                  data-view-component="true"
                  className="fill-current"
                >
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                </svg>
              </span>
              <h3 className="text-blue-400 font-semibold text-sm truncate group-hover:underline transition-all">
                {repo.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-white/50 font-medium">
                Public
              </span>
            </div>
            <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-4 h-8">
              {repo.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-white/60">
            {repo.primaryLanguage && (
              <div className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: repo.primaryLanguage.color }}
                />
                <span>{repo.primaryLanguage.name}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" />
              <span>{repo.stargazerCount}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5" />
              <span>{repo.forkCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
