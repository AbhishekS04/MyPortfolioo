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

export async function fetchGithubCommits(
  githubUrl: string,
): Promise<GithubCommit[]> {
  try {
    console.log('Fetching commits for:', githubUrl);

    // Improved Regex: Handles trailing slashes and common subpaths
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/?#]+)/);
    if (!match) {
      console.error('Invalid GitHub URL format:', githubUrl);
      return [];
    }

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, '');

    const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=100`;
    console.log('GitHub API Call:', apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        `GitHub API Error (${response.status}):`,
        errorData.message || response.statusText,
      );

      if (response.status === 404) {
        console.warn(
          'Hint: The repository might be private or the URL is incorrect.',
        );
      } else if (response.status === 403) {
        console.warn(
          'Hint: You might have hit the GitHub API rate limit (60 requests/hr for unauthorized).',
        );
      }

      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error('GitHub API returned non-array data:', data);
      return [];
    }

    console.log(`Successfully fetched ${data.length} commits.`);
    return data;
  } catch (error) {
    console.error('Network error fetching commits:', error);
    return [];
  }
}
