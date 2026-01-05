export interface GithubCommit {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    author: {
        avatar_url: string;
        login: string;
    } | null;
    html_url: string;
}

export async function fetchGithubCommits(githubUrl: string): Promise<GithubCommit[]> {
    try {
        // Parse owner and repo from URL
        // Example: https://github.com/AbhishekS04/ppppfffff
        const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return [];

        const [, owner, repo] = match;
        // Strip trailing .git if present
        const cleanRepo = repo.replace(/\.git$/, "");

        const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=10`);
        if (!response.ok) {
            console.error("GitHub API error:", response.statusText);
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching commits:", error);
        return [];
    }
}
