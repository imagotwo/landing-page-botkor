import type { MetadataRoute } from "next";
import { landingUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: landingUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
