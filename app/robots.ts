import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/interno/",
    },
    sitemap: "https://jpabrahao.com.br/sitemap.xml",
  }
}
