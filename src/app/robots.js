// src/app/robots.js
import siteData from "@/data/site.json";

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteData.site.url}/sitemap.xml`,
  };
}