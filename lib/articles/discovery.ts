import type { Article, ArticleCategory } from "@/lib/articles/types";

export type ArticleListItem = Pick<
  Article,
  | "id"
  | "title"
  | "slug"
  | "category"
  | "evidenceLevel"
  | "summary"
  | "publishedDate"
  | "updatedDate"
  | "readingTime"
  | "image"
>;

export type ArticleSort = "newest" | "oldest" | "reading-time";

export function createArticleIndex(articles: readonly Article[]): ArticleListItem[] {
  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    category: article.category,
    evidenceLevel: article.evidenceLevel,
    summary: article.summary,
    publishedDate: article.publishedDate,
    updatedDate: article.updatedDate,
    readingTime: article.readingTime,
    image: article.image,
  }));
}

export function getArticleCategories(articles: readonly ArticleListItem[]): ArticleCategory[] {
  return Array.from(new Set(articles.map((article) => article.category)));
}

export function normalizeArticleSearch(value: string): string {
  return value.trim().toLocaleLowerCase("tr-TR");
}

export function getReadingMinutes(readingTime: string): number {
  const value = Number.parseInt(readingTime, 10);
  return Number.isFinite(value) ? value : 0;
}

export function filterArticleIndex(
  articles: readonly ArticleListItem[],
  options: { query?: string; category?: string; sort?: ArticleSort },
): ArticleListItem[] {
  const query = normalizeArticleSearch(options.query ?? "");
  const category = options.category ?? "";
  const sort = options.sort ?? "newest";

  return articles
    .filter((article) => {
      if (category && article.category !== category) return false;
      if (!query) return true;
      const searchable = [article.title, article.summary, article.category]
        .map(normalizeArticleSearch)
        .join(" ");
      return searchable.includes(query);
    })
    .toSorted((first, second) => {
      if (sort === "oldest") return first.publishedDate.localeCompare(second.publishedDate);
      if (sort === "reading-time") return getReadingMinutes(first.readingTime) - getReadingMinutes(second.readingTime);
      return second.publishedDate.localeCompare(first.publishedDate);
    });
}

export function formatArticleDate(date: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
