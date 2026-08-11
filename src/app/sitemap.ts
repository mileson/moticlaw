import type { MetadataRoute } from "next";
import { getIndexableSiteRoutes } from "@/components/seo-resource-manifest";
import { blogPosts } from "@/lib/blog-posts";
import { docPages } from "@/lib/docs-content";

const siteUrl = "https://www.moticlaw.com";

function entry(path: string, lastModified: string, changeFrequency: "daily" | "weekly" | "monthly", priority: number) {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        "zh-CN": `${siteUrl}${path}`,
        en: `${siteUrl}${path}?lang=en`,
        "x-default": `${siteUrl}${path}`,
      },
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogUpdatedAt = latestUpdatedAt(blogPosts.map((post) => post.updatedAt));
  const docsUpdatedAt = latestUpdatedAt(docPages.map((doc) => doc.updatedAt));
  const staticEntries = getIndexableSiteRoutes().map((route) =>
    entry(
      route.path,
      route.id === "blog" ? blogUpdatedAt : route.id === "docs" ? docsUpdatedAt : route.lastModified,
      route.changeFrequency,
      route.priority,
    ),
  );

  const blogEntries = blogPosts.map((post) => entry(`/blog/${post.slug}`, post.updatedAt, "monthly", 0.7));

  const docEntries = docPages
    .filter((doc) => doc.slug !== "index")
    .map((doc) => entry(`/docs/${doc.slug}`, doc.updatedAt, "monthly", 0.68));

  return [...staticEntries, ...blogEntries, ...docEntries];
}

function latestUpdatedAt(values: string[]) {
  return values.reduce((latest, value) => (value > latest ? value : latest), "1970-01-01");
}
