import ArticleCard from "@/components/articles/ArticleCard";
import type { ArticleListItem } from "@/lib/articles/discovery";

type ArticleGridProps = { articles: readonly ArticleListItem[] };

export default function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          title={article.title}
          category={article.category}
          evidenceLevel={article.evidenceLevel}
          readingTime={article.readingTime}
          publishedDate={article.publishedDate}
          updatedDate={article.updatedDate}
          summary={article.summary}
          image={article.image}
          href={`/articles/${article.slug}`}
        />
      ))}
    </div>
  );
}
