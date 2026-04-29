import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin/",
      },
      {
        // Allow all AI crawlers to index and cite this portfolio
        userAgent: [
          "GPTBot", // ChatGPT (OpenAI)
          "OAI-SearchBot", // OpenAI Search
          "ChatGPT-User", // ChatGPT browsing
          "ClaudeBot", // Claude (Anthropic)
          "Claude-Web", // Claude web browsing
          "anthropic-ai", // Anthropic AI
          "PerplexityBot", // Perplexity AI
          "Google-Extended", // Gemini & Google AI Overviews
          "Bingbot", // Microsoft Copilot AI answers
          "Applebot-Extended", // Apple intelligence
          "cohere-ai", // Cohere AI
          "Bytespider", // ByteDance AI
        ],
        allow: "/",
      },
    ],
    sitemap: "https://abhisheksingh.tech/sitemap.xml",
  };
}
