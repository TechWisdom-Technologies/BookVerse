import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bookverse.app";

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
