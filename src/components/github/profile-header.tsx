"use client";

import { m } from "framer-motion";
import Image from "next/image";
import {
  Users,
  MapPin,
  Link as LinkIcon,
  Mail,
  Building,
  Twitter,
} from "lucide-react";
import { GitHubProfile, GitHubAchievement } from "@/lib/github";
import Link from "next/link";

export function GitHubProfileHeader({
  profile,
  achievements,
}: {
  profile: GitHubProfile;
  achievements: GitHubAchievement[];
}) {
  return (
    <m.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      {/* Avatar Circle with Status Mock */}
      <div className="relative group w-fit mx-auto md:mx-0">
        <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border border-white/10 relative z-10 bg-[#0d1117]">
          <Image
            src={profile.avatarUrl}
            alt={profile.login}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Status Bubble Mock - Ghost Icon as per screenshot request */}
        <div className="absolute bottom-8 right-0 md:right-4 z-20 w-10 h-10 bg-[#1f242c] rounded-full border border-white/10 flex items-center justify-center text-lg shadow-lg">
          👻
        </div>
      </div>

      {/* Name & Login */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-white leading-tight">
          {profile.name}
        </h1>
        <p className="text-xl text-white/50 font-normal">
          {profile.login} <span className="text-white/30">• he/him</span>
        </p>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-white/80 text-base leading-relaxed text-center md:text-left">
          {profile.bio}
        </p>
      )}

      {/* Follow Stats */}
      <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-white/60">
        <div className="flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer">
          <Users className="w-4 h-4" />
          <span className="text-white font-bold">
            {profile.followers.totalCount}
          </span>{" "}
          followers
        </div>
        <span>•</span>
        <div className="hover:text-blue-400 transition-colors cursor-pointer">
          <span className="text-white font-bold">
            {profile.following.totalCount}
          </span>{" "}
          following
        </div>
      </div>

      {/* Meta Info List */}
      <div className="flex flex-col gap-2 text-sm text-white/60">
        {profile.company && (
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span>{profile.company}</span>
          </div>
        )}
        {profile.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{profile.location}</span>
          </div>
        )}
        {profile.email && (
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <Mail className="w-4 h-4" />
            <span>{profile.email}</span>
          </a>
        )}
        {profile.websiteUrl && (
          <a
            href={profile.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-400 truncate"
          >
            <LinkIcon className="w-4 h-4" />
            <span>{profile.websiteUrl}</span>
          </a>
        )}
        {profile.twitterUsername && (
          <a
            href={`https://twitter.com/${profile.twitterUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <Twitter className="w-4 h-4" />
            <span>@{profile.twitterUsername}</span>
          </a>
        )}
      </div>

      {/* Achievements (Real Data) */}
      {achievements.length > 0 && (
        <div className="pt-6 border-t border-white/10">
          <h3 className="text-white font-semibold mb-3">Achievements</h3>
          <div className="flex gap-2">
            {achievements.map((badge) => (
              <div
                key={badge.name}
                className="w-16 h-16 relative group cursor-help"
                title={`${badge.name}: ${badge.description}`}
              >
                <Image
                  src={badge.imageUrl}
                  alt={badge.name}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Organizations (Real Data) */}
    </m.div>
  );
}
