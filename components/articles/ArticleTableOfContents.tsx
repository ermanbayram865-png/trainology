import Card from "@/components/ui/Card";

export type ArticleTableOfContentsItem = {
  id: string;
  label: string;
};

type ArticleTableOfContentsProps = {
  items: readonly ArticleTableOfContentsItem[];
};

export default function ArticleTableOfContents({ items }: ArticleTableOfContentsProps) {
  return (
    <Card title="Bu rehberde" variant="subtle" className="p-6 xl:sticky xl:top-32">
      <nav aria-label="Makale içindekiler">
        <ol className="space-y-3 text-sm leading-6 text-neutral-400">
          {items.map((item) => (
            <li key={item.id}>
              <a className="transition hover:text-[#C9A14A]" href={`#${item.id}`}>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </Card>
  );
}
