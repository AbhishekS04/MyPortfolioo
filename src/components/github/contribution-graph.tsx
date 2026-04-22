"use client";

import { motion } from "framer-motion";
import { GitHubProfile } from "@/lib/github";

export function ContributionGraph({ profile }: { profile: GitHubProfile }) {
  const { contributionCalendar } = profile.contributionsCollection;
  const { weeks, totalContributions } = contributionCalendar;

  // Helper to get color class - GitHub returns hex, but we might map to tailwind for better theme
  // We will use the color provided by GitHub API but ensure it renders nicely on dark

  // Reverse weeks if needed, or just map efficiently.
  // GitHub weeks are usually Sunday-Saturday.

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-[#0d1117] border border-white/5 rounded-[24px] p-6 lg:p-8 overflow-x-auto"
    >
      <div className="flex items-center justify-between mb-6 min-w-[600px]">
        <h3 className="text-white font-medium text-lg">
          {totalContributions} contributions in the last year
        </h3>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-[#161b22]" />
            <div className="w-3 h-3 rounded-sm bg-[#0e4429]" />
            <div className="w-3 h-3 rounded-sm bg-[#006d32]" />
            <div className="w-3 h-3 rounded-sm bg-[#26a641]" />
            <div className="w-3 h-3 rounded-sm bg-[#39d353]" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-1 min-w-[700px]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.contributionDays.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="w-[10px] h-[10px] rounded-[2px] transition-all duration-200 hover:scale-125 relative group"
                style={{
                  backgroundColor:
                    day.contributionCount === 0 ? "#161b22" : day.color,
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                  {day.contributionCount} contributions on{" "}
                  {new Date(day.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
