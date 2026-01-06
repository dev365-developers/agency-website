import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/dashboard/",
          "/sso-callback/",
          "/providers/",
          "/admin/",
          "/private/",
        ],
      },
    ],
    sitemap: "https://www.dev365.in/sitemap.xml",
  };
}
