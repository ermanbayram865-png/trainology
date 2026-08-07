import { articles } from "../../../data/articles";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;

  const article = articles.find(
    (item) => item.slug === slug
  );

  if (!article) {
    return (
      <main className="mx-auto max-w-4xl p-10">
        <h1 className="text-4xl font-bold">
          Makale bulunamadı.
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-10">
      <p className="text-blue-400">
        {article.category}
      </p>

      <h1 className="mt-3 text-5xl font-bold">
        {article.title}
      </h1>

      <p className="mt-8 text-zinc-400">
        Bu içerik ileride veritabanından gelecek.
      </p>
    </main>
  );
}