import type { MetadataRoute } from "next";
import { pageDates } from "@/content/landing";
import { landingUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Fecha real de la última actualización del contenido (la misma de article:modified_time y del JSON-LD).
  return [{ url: landingUrl, lastModified: pageDates.modified, changeFrequency: "monthly", priority: 1 }];
}
