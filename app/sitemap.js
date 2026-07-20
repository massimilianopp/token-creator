import { articles } from "@/content/docs";

export default function sitemap() {
  const baseUrl = "https://token-creator.space";

  const staticPages = [
    {
      path: "",
      priority: 1,
      changeFrequency: "weekly",
    },
    {
      path: "/docs",
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      path: "/vesting",
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      path: "/pool",
      priority: 0.8,
      changeFrequency: "weekly",
    },
    {
      path: "/explore",
      priority: 0.8,
      changeFrequency: "daily",
    },
    {
      path: "/help",
      priority: 0.6,
      changeFrequency: "monthly",
    },
    {
      path: "/privacy",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      path: "/terms",
      priority: 0.3,
      changeFrequency: "yearly",
    },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),

    ...articles.map((article) => ({
      url: `${baseUrl}/docs/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}