import type { Article } from "@/lib/articles/types";

export function getRelatedArticles(article: Article, articles: readonly Article[]): Article[] {
  return articles
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate, index) => ({
      candidate,
      index,
      categoryMatch: candidate.category === article.category ? 1 : 0,
    }))
    .toSorted((first, second) =>
      second.categoryMatch - first.categoryMatch || first.index - second.index,
    )
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}
