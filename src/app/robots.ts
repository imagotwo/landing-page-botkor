import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Permite explícitamente a buscadores clásicos y a rastreadores de IA (GEO).
 * Solo se bloquea /api/: endpoints sin contenido indexable.
 */
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: "/api/" },
      { userAgent: "*", allow: "/", disallow: "/api/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
