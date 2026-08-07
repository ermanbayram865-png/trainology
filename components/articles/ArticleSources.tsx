import Card from "@/components/ui/Card";

type ArticleSourcesProps = {
  sources: readonly string[];
};

export default function ArticleSources({ sources }: ArticleSourcesProps) {
  return (
    <Card title="Bilimsel kaynaklar" variant="subtle" className="max-w-4xl">
      <ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-neutral-400">
        {sources.map((source) => (
          <li key={source}>{source}</li>
        ))}
      </ul>
    </Card>
  );
}
