import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bookversebd.site";
  const baseUrl = rawUrl.replace("https://bookversebd.site", "https://www.bookversebd.site");

  // Static routes
  const routes = ["", "/library", "/stories", "/search", "/login"];
  
  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  return staticRoutes;
}
