const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string; // GitHub provided hex code
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface GitHubProfile {
  name: string;
  login: string;
  avatarUrl: string;
  bio: string;
  location: string;
  company: string;
  twitterUsername: string;
  websiteUrl: string;
  email: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  pinnedItems: {
    nodes: GitHubRepo[];
  };
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
      weeks: ContributionWeek[];
    };
  };
  organizations?: {
    nodes: {
      name: string;
      avatarUrl: string;
      login: string;
    }[];
  };
}

export async function getGitHubProfile(username: string): Promise<GitHubProfile | null> {
  const token = process.env.GITHUB_TOKEN;

  // If no token, we can't reliably get pinned items via GraphQL.
  // Fallback or just return null/error if essential.
  if (!token) {
    // Avoid error logs in CI/CD when token is intentionally missing
    if (process.env.NODE_ENV !== "production") {
      console.warn("GITHUB_TOKEN is missing! GitHub profile data will be unavailable.");
    }
    return null;
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        name
        login
        avatarUrl
        bio
        location
        company
        twitterUsername
        websiteUrl
        followers { totalCount }
        following { totalCount }
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage {
                name
                color
              }
            }
          }
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
        organizations(first: 10) {
            nodes {
                name
                avatarUrl
                login
            }
        }
      }
    }
  `;

  try {
    const res = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 60 }, // ISR: Cache for 60 seconds
    });

    const json = await res.json();

    // Log errors but try to return partial data if user exists
    if (json.errors) {
      console.error("GitHub API Errors:", JSON.stringify(json.errors, null, 2));
    }

    if (json.data?.user) {
      return json.data.user;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch GitHub profile:", error);
    return null;
  }
}

export async function getGitHubReadme(username: string): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  // Fetching the README of the special repository [username]/[username]
  try {
    const res = await fetch(`https://api.github.com/repos/${username}/${username}/readme`, {
      headers: {
        Accept: "application/vnd.github.html", // Get rendered HTML
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) return null;
    return await res.text();
  } catch (e) {
    return null;
  }
}

export interface GitHubAchievement {
  name: string;
  description: string;
  imageUrl: string;
}

export async function getGitHubAchievements(username: string): Promise<GitHubAchievement[]> {
  // Note: GitHub GraphQL API does NOT expose achievements. 
  // We are simulating a fetch for the user's specific known achievements.
  // In a production app, this would require a custom scraper or 3rd party API.
  return [
    {
      name: "Quickdraw",
      description: "Closed an issue or pull request within 5 minutes of opening.",
      imageUrl: "https://raw.githubusercontent.com/Schweinepriester/github-profile-achievements/main/images/quickdraw-default.png"
    },
    {
      name: "Pull Shark",
      description: "Opened a pull request that was merged.",
      imageUrl: "https://raw.githubusercontent.com/Schweinepriester/github-profile-achievements/main/images/pull-shark-default.png"
    },
    {
      name: "YOLO",
      description: "Merged a pull request without code review.",
      imageUrl: "https://raw.githubusercontent.com/Schweinepriester/github-profile-achievements/main/images/yolo-default.png"
    }
  ];
}
