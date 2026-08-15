import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.legalName,
    short_name: BRAND.name,
    description: `${BRAND.tagline} em ${BRAND.cityState}`,
    start_url: "/",
    display: "standalone",
    background_color: "#f8f5f1",
    theme_color: "#f8f5f1",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
