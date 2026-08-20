
import siteData from "@/data/site.json";

export default function manifest() {
  return {
    name: siteData.site.name,
    short_name: "SpotOptics",
    description: siteData.site.description,
    start_url: "/",
    display: "standalone",
    background_color: siteData.site.backgroundColor || "#F8FAFC",
    theme_color: siteData.site.theme_color || "#1E5EFF",
    icons: [
      {
        src: siteData.site.logo || "/assets/icons/favicon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: siteData.site.logo || "/assets/icons/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}