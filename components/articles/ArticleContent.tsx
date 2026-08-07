import Card from "@/components/ui/Card";

type ArticleContentProps = {
  sections: readonly {
    id: string;
    title: string;
    content: string;
  }[];
};

export default function ArticleContent({ sections }: ArticleContentProps) {
  return (
    <Card variant="subtle" className="max-w-4xl">
      <div className="divide-y divide-white/10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="py-7 first:pt-0 last:pb-0">
            <h3 className="text-xl font-semibold text-white">{section.title}</h3>
            <p className="mt-4 text-base leading-8 text-neutral-300">{section.content}</p>
          </section>
        ))}
      </div>
    </Card>
  );
}
