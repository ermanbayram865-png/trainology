import type { MetadataRoute } from "next";

import { ENERGY_LAB_PATH } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const staticPages: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
  { url: absoluteUrl("/calculators"), changeFrequency: "monthly", priority: 0.9 },
  { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.5 },
  { url: absoluteUrl("/kvkk-aydinlatma-metni"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/gizlilik-politikasi"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/cerez-ve-yerel-depolama-politikasi"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/kullanim-kosullari"), changeFrequency: "yearly", priority: 0.3 },
];

const calculatorPaths = [
  ENERGY_LAB_PATH,
  "/calculators/protein",
  "/calculators/macro",
  "/calculators/ffmi",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages,
    ...calculatorPaths.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
