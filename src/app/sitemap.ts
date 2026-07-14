import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, lastModified: new Date(), priority: 1 },
    { url: `${siteConfig.url}/order`, lastModified: new Date(), priority: 0.8 },
  ];
}
