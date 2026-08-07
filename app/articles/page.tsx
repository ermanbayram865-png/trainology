import type { Metadata } from "next";
import { Suspense } from "react";

import ArticleLibrary from "@/components/articles/ArticleLibrary";
import Section from "@/components/ui/Section";
import { articles } from "@/data/articles/articles";
import { createArticleIndex } from "@/lib/articles/discovery";

export const metadata: Metadata = {
  alternates: {
    canonical: "/articles",
  },
};

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-12">
        <Suspense fallback={<div className="h-96" />}>
          <ArticleLibrary articles={createArticleIndex(articles)} />
        </Suspense>
      </Section>
    </main>
  );
}
