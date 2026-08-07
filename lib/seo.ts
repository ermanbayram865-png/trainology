const fallbackSiteUrl = "https://trainology.example";

export const siteConfig = {
  name: "Trainology",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl).replace(/\/$/, ""),
  defaultOpenGraphImage: "/images/hero/trainology-hero-object.png",
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
