import Card from "@/components/ui/Card";
import type { ArticleFaq as ArticleFaqItem } from "@/lib/articles/types";

type ArticleFaqProps = {
  faq: readonly ArticleFaqItem[];
};

export default function ArticleFaq({ faq }: ArticleFaqProps) {
  return (
    <Card variant="subtle" className="max-w-4xl">
      <div className="divide-y divide-white/10">
        {faq.map((item) => (
          <details key={item.question} className="group py-5 first:pt-0 last:pb-0">
            <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-white marker:content-none">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-7 text-neutral-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </Card>
  );
}
