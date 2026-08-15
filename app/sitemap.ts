import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BRAND.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BRAND.siteUrl}/politica-de-privacidade`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
