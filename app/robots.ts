import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/painel", "/api/"],
      },
    ],
    sitemap: `${BRAND.siteUrl}/sitemap.xml`,
  };
}
