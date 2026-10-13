import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bookversebd.site";
  const baseUrl = rawUrl.replace("https://bookversebd.site", "https://www.bookversebd.site");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/write/",
          "/upload/",
          "/profile/edit/",
          "/shelf/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
