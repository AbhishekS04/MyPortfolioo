import { getGitHubProfile, getGitHubReadme, getGitHubAchievements } from "@/lib/github";
import { GitHubProfileHeader } from "@/components/github/profile-header";
import { RepoCard } from "@/components/github/repo-card";
import { ReadmeViewer } from "@/components/github/readme-viewer";
import { ContributionGraph } from "@/components/github/contribution-graph";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
    const { username } = await params;
    return {
        title: `${username} - GitHub Profile`,
        description: `View ${username}'s open source contributions and projects.`,
    };
}

export default async function GitHubPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    // Parallel Fetching for Speed
    const [profile, readme, achievements] = await Promise.all([
        getGitHubProfile(username),
        getGitHubReadme(username),
        getGitHubAchievements(username)
    ]);

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#050805] text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
                <p className="text-white/50 mb-8 max-w-md text-center">
                    Could not fetch data for "{username}". This might happen if the GitHub API Token is missing or the user does not exist.
                </p>
                <Link href="/" className="px-6 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform">
                    Go Home
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050805] text-white selection:bg-blue-500/30">

            {/* Navbar Placeholder / Back Button */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-[#050805] to-transparent pointer-events-none">
                <Link href="/" className="pointer-events-auto flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Portfolio</span>
                </Link>
            </nav>

            <div className="max-w-[1400px] mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Sidebar (Left Column) */}
                    <aside className="lg:col-span-3 lg:static top-24 h-fit">
                        <GitHubProfileHeader profile={profile} achievements={achievements} />
                    </aside>

                    {/* Main Content (Right Column) */}
                    <div className="lg:col-span-9 flex flex-col gap-8">

                        {/* 1. README */}
                        {readme && (
                            <section className="w-full">
                                <ReadmeViewer content={readme} />
                            </section>
                        )}

                        {/* 2. Pinned Repos */}
                        <section>
                            <h2 className="text-base font-semibold text-white mb-4">Pinned</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.pinnedItems.nodes.length > 0 ? (
                                    profile.pinnedItems.nodes.map((repo, idx) => (
                                        <RepoCard key={repo.name} repo={repo} index={idx} />
                                    ))
                                ) : (
                                    <p className="text-white/40 col-span-full text-sm">No pinned repositories found.</p>
                                )}
                            </div>
                        </section>

                        {/* 3. Contribution Graph */}
                        <section>
                            <h2 className="text-base font-semibold text-white mb-4">Contributions</h2>
                            <div className="w-full overflow-hidden">
                                <ContributionGraph profile={profile} />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
