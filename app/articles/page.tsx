import Link from "next/link";
import { articles } from "../../data/articles";

export default function ArticlesPage() {
  return (
    <main className="mx-auto max-w-6xl px-8 py-16">
      <h1 className="text-5xl font-bold">
        Makaleler
      </h1>

      <p className="mt-4 text-zinc-400">
        Bilimsel içeriklerimizi keşfedin.
      </p>

      <div className="mt-12 space-y-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="block rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-white"
          >
            <p className="text-sm text-blue-400">
              {article.category}
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {article.title}
            </h2>
          </Link>
        ))}
      </div>
    </main>
  );
}