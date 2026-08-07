import ArticleCard from "@/components/articles/ArticleCard";
import type { Article } from "@/lib/articles/types";

type ArticleGridProps = { articles: readonly Article[] };

export default function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          title={article.title}
          category={article.category}
          evidenceLevel={article.evidenceLevel}
          summary={article.summary}
          href={`/articles/${article.slug}`}
        />
      ))}
    </div>
  );
}
