import Card from "@/components/ui/Card";
import { removeInlineCitationMarkers } from "@/lib/articles/formatters";

type ArticleContentProps = {
  sections: readonly {
    id: string;
    title: string;
    content: readonly string[];
  }[];
};

export default function ArticleContent({ sections }: ArticleContentProps) {
  return (
    <Card variant="subtle" className="max-w-4xl">
      <div className="divide-y divide-white/10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="py-7 first:pt-0 last:pb-0">
            <h3 className="text-xl font-semibold text-white">{section.title}</h3>
            <div className="mt-4 space-y-5 text-base leading-8 text-neutral-300">
              {section.content.map((paragraph) => (
                <p key={paragraph}>{removeInlineCitationMarkers(paragraph)}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Card>
  );
}
