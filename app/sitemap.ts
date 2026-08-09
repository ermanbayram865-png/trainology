import type { MetadataRoute } from "next";

import { articles } from "@/data/articles/articles";
import { movements } from "@/data/movements/movements";
import { supplements } from "@/data/supplements/supplements";
import { absoluteUrl } from "@/lib/seo";

const staticPages: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
  { url: absoluteUrl("/articles"), changeFrequency: "weekly", priority: 0.9 },
  { url: absoluteUrl("/calculators"), changeFrequency: "monthly", priority: 0.9 },
  { url: absoluteUrl("/movements"), changeFrequency: "weekly", priority: 0.9 },
  { url: absoluteUrl("/supplements"), changeFrequency: "weekly", priority: 0.9 },
  { url: absoluteUrl("/analysis"), changeFrequency: "monthly", priority: 0.8 },
  { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.5 },
  { url: absoluteUrl("/kvkk-aydinlatma-metni"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/gizlilik-politikasi"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/cerez-ve-yerel-depolama-politikasi"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/kullanim-kosullari"), changeFrequency: "yearly", priority: 0.3 },
];

const calculatorPaths = [
  "/calculators/calorie",
  "/calculators/protein",
  "/calculators/macro",
  "/calculators/ffmi",
  "/calculators/1rm",
  "/calculators/performance",
  "/calculators/water",
  "/calculators/healthy-weight",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages,
    ...articles.map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: article.updatedDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...calculatorPaths.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...movements.map((movement) => ({
      url: absoluteUrl(`/movements/${movement.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...supplements.map((supplement) => ({
      url: absoluteUrl(`/supplements/${supplement.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
