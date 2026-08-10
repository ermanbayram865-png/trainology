import type { MetadataRoute } from "next";

import { movements } from "@/data/movements/movements";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const staticPages: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
  { url: absoluteUrl("/calculators"), changeFrequency: "monthly", priority: 0.9 },
  { url: absoluteUrl("/movements"), changeFrequency: "weekly", priority: 0.9 },
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
  ];
}
