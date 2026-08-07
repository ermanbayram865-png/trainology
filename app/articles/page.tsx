import type { Metadata } from "next";

import ArticleGrid from "@/components/articles/ArticleGrid";
import ArticleHeader from "@/components/articles/ArticleHeader";
import Section from "@/components/ui/Section";
import { articles } from "@/data/articles/articles";

export const metadata: Metadata = {
  alternates: {
    canonical: "/articles",
  },
};

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-12">
        <ArticleHeader count={articles.length} />
        <ArticleGrid articles={articles} />
      </Section>
    </main>
  );
}
