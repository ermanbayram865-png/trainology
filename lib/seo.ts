const developmentSiteUrl = "http://localhost:3000";

function getSiteOrigin(): string {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isProduction = process.env.NODE_ENV === "production";

  if (!configuredSiteUrl) {
    if (isProduction) {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL is required in production and must be the public HTTPS origin.",
      );
    }

    return developmentSiteUrl;
  }

  let siteUrl: URL;

  try {
    siteUrl = new URL(configuredSiteUrl);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be a valid HTTP or HTTPS origin, for example https://example.com.",
    );
  }

  if (siteUrl.protocol !== "http:" && siteUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use the http or https protocol.");
  }

  if (
    siteUrl.username ||
    siteUrl.password ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must contain only the site origin, without credentials, a path, query, or hash.",
    );
  }

  if (isProduction) {
    const isLocalhost =
      siteUrl.hostname === "localhost" ||
      siteUrl.hostname.endsWith(".localhost") ||
      siteUrl.hostname === "127.0.0.1" ||
      siteUrl.hostname === "::1";

    if (siteUrl.protocol !== "https:" || isLocalhost) {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL must be a public HTTPS origin in production.",
      );
    }
  }

  return siteUrl.origin;
}

const siteOrigin = getSiteOrigin();

export const siteConfig = {
  name: "Trainology",
  url: siteOrigin,
  defaultOpenGraphImage: "/images/hero/trainology-hero-object.png",
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}
