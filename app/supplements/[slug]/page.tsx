import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MovementShareActions from "@/components/movements/MovementShareActions";
import FavoriteSupplementButton from "@/components/supplements/FavoriteSupplementButton";
import SupplementEvidenceBadge from "@/components/supplements/SupplementEvidenceBadge";
import SupplementRelated from "@/components/supplements/SupplementRelated";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { getSupplementBySlug, supplements } from "@/data/supplements/supplements";
import { getRelatedSupplements } from "@/lib/supplements/discovery";
import type { ClaimEvidenceGrade, Supplement, SupplementEvidenceContent, SupplementReference } from "@/lib/supplements/types";
import { absoluteUrl } from "@/lib/seo";

type SupplementDetailPageProps = { params: Promise<{ slug: string }> };

const nextSteps = [
  { title: "Performance Analysis", href: "/analysis", description: "Antrenman ve beslenme verilerini birlikte değerlendir." },
  { title: "Makro Hesaplayıcı", href: "/calculators/macro", description: "Günlük makro hedeflerini hesapla." },
  { title: "Bilimsel İçerikler", href: "/articles", description: "Kanıta dayalı rehberleri incele." },
  { title: "Supplement Library", href: "/supplements", description: "Tüm supplement rehberlerine dön." },
] as const;

const gradeVariants: Record<ClaimEvidenceGrade, "success" | "gold" | "warning" | "neutral"> = {
  Strong: "success",
  Moderate: "gold",
  Limited: "warning",
  "Not Supported": "neutral",
};

export async function generateMetadata({ params }: SupplementDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supplement = getSupplementBySlug(slug);
  if (!supplement) return {};
  return {
    title: supplement.name,
    description: supplement.evidenceContent.oneLiner,
    alternates: { canonical: `/supplements/${slug}` },
    openGraph: {
      title: supplement.name,
      description: supplement.evidenceContent.oneLiner,
      images: [{ url: absoluteUrl(supplement.image), alt: `${supplement.name} supplement görseli` }],
    },
  };
}

export default async function SupplementDetailPage({ params }: SupplementDetailPageProps) {
  const { slug } = await params;
  const supplement = getSupplementBySlug(slug);
  if (!supplement) notFound();
  const content = supplement.evidenceContent;
  const related = getRelatedSupplements(supplement, supplements);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-16">
        <SupplementHero supplement={supplement} />
        <QuickSummary content={content} />
        <ClaimEvidence content={content} />
        <ScienceBasics content={content} />
        <Audience content={content} />
        <ResearchProtocols content={content} />
        <Safety content={content} />
        <Myths content={content} />
        <Limitations content={content} />
        <Verdict content={content} />
        <References references={content.references} />
        <SupplementRelated supplements={related} />
        <NextSteps />
      </Section>
    </main>
  );
}

function SupplementBreadcrumbs({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
      <Link href="/" className="transition hover:text-[#C9A14A] focus-visible:outline-none focus-visible:underline">Ana Sayfa</Link>
      <span aria-hidden="true">/</span>
      <Link href="/supplements" className="transition hover:text-[#C9A14A] focus-visible:outline-none focus-visible:underline">Supplement Library</Link>
      <span aria-hidden="true">/</span>
      <span className="text-neutral-300">{name}</span>
    </nav>
  );
}

function SupplementHero({ supplement }: { supplement: Supplement }) {
  const hasImage = supplement.image.trim().length > 0;

  return (
    <section aria-labelledby="supplement-title" className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] p-6 shadow-[0_28px_80px_rgba(0,0,0,.32)] sm:p-8 lg:p-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[#C9A14A]/[0.06] blur-3xl" />
      <div className="relative">
        <SupplementBreadcrumbs name={supplement.name} />
        <div className={`mt-8 grid items-center gap-10 ${hasImage ? "lg:grid-cols-[minmax(0,1fr)_26.125rem] lg:gap-14" : ""}`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A14A]">Supplement Science</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="neutral">{supplement.category}</Badge>
              <SupplementEvidenceBadge evidenceLevel={supplement.evidenceLevel} />
            </div>
            <h1 id="supplement-title" className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">{supplement.name}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300 sm:text-lg">{supplement.evidenceContent.oneLiner}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <FavoriteSupplementButton slug={supplement.slug} />
              <MovementShareActions url={absoluteUrl(`/supplements/${supplement.slug}`)} />
            </div>
          </div>
          {hasImage && (
            <div className="relative mx-auto aspect-square w-full max-w-[26.125rem] overflow-hidden rounded-[1.75rem] border border-[#C9A14A]/20 bg-[radial-gradient(circle_at_50%_45%,rgba(201,161,74,.15),transparent_52%),#070707] shadow-[inset_0_0_0_1px_rgba(255,255,255,.02),0_24px_60px_rgba(0,0,0,.35)]">
              <Image src={supplement.image} alt={`${supplement.name} supplement görseli`} fill preload sizes="(min-width: 1024px) 418px, (min-width: 640px) 60vw, 88vw" className="object-contain p-5 sm:p-7" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function QuickSummary({ content }: { content: SupplementEvidenceContent }) {
  if (!content.quickUses.length) return null;
  return (
    <section aria-labelledby="quick-summary-title">
      <SectionHeading eyebrow="Hızlı Bakış" title="Kısaca Ne İşe Yarar?" id="quick-summary-title" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {content.quickUses.map((use, index) => (
          <Card key={use} variant="subtle" className="h-full p-6">
            <span className="text-xs font-semibold text-[#C9A14A]">0{index + 1}</span>
            <p className="mt-4 text-base font-medium leading-7 text-neutral-200">{use}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ClaimEvidence({ content }: { content: SupplementEvidenceContent }) {
  if (!content.evidence.length) return null;
  return (
    <section aria-labelledby="claim-evidence-title">
      <SectionHeading eyebrow="Claim-Specific Evidence" title="Bilimsel Kanıt Ne Kadar Güçlü?" id="claim-evidence-title" description="Her kullanım iddiası kendi araştırma sonucu ve kanıt gücüyle değerlendirilir." />
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {content.evidence.map((claim) => (
          <Card key={claim.claim} variant={claim.grade === "Strong" ? "gold" : "subtle"} className="h-full p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="max-w-md text-lg font-semibold leading-6 text-white">{claim.claim}</h3>
              <Badge variant={gradeVariants[claim.grade]}>{claim.grade}</Badge>
            </div>
            <p className="mt-5 text-sm leading-7 text-neutral-300">{claim.conclusion}</p>
            {claim.practicalInterpretation && <p className="mt-4 border-l-2 border-[#C9A14A]/50 pl-4 text-sm leading-6 text-neutral-500">{claim.practicalInterpretation}</p>}
            <div className="mt-5 flex flex-wrap gap-2">
              {claim.referenceIds.map((id) => <span key={id} className="rounded-full border border-white/10 px-2.5 py-1 text-[0.6875rem] text-neutral-500">{id}</span>)}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ScienceBasics({ content }: { content: SupplementEvidenceContent }) {
  if (!content.whatItIs && !content.mechanism) return null;
  return (
    <section aria-label="Supplement temelleri" className="grid gap-6 md:grid-cols-2">
      {content.whatItIs && <InfoCard title="Nedir?" text={content.whatItIs} />}
      {content.mechanism && <InfoCard title="Nasıl Çalışır?" text={content.mechanism} />}
    </section>
  );
}

function Audience({ content }: { content: SupplementEvidenceContent }) {
  if (!content.whoMayBenefit?.length && !content.whoMayNotNeed?.length) return null;
  return (
    <section aria-label="Kimler için uygunluk" className="grid gap-6 md:grid-cols-2">
      {content.whoMayBenefit?.length ? <ListCard title="Kimler İçin Anlamlı Olabilir?" items={content.whoMayBenefit} /> : null}
      {content.whoMayNotNeed?.length ? <ListCard title="Kimler İçin Düşük Öncelik?" items={content.whoMayNotNeed} /> : null}
    </section>
  );
}

function ResearchProtocols({ content }: { content: SupplementEvidenceContent }) {
  if (!content.researchProtocols?.length) return null;
  return (
    <section aria-labelledby="protocols-title">
      <SectionHeading eyebrow="Araştırma Bağlamı" title="Kullanım ve Araştırma Protokolleri" id="protocols-title" description="Aşağıdaki değerler kişisel reçete değil, araştırmalarda kullanılan protokollerdir." />
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {content.researchProtocols.map((protocol) => (
          <Card key={`${protocol.label}-${protocol.protocol}`} variant="subtle" className="h-full p-6">
            <h3 className="text-lg font-semibold text-white">{protocol.label}</h3>
            <dl className="mt-5 space-y-4 text-sm">
              <Definition label="Protokol" value={protocol.protocol} />
              {protocol.timing && <Definition label="Zamanlama" value={protocol.timing} />}
              {protocol.form && <Definition label="Form" value={protocol.form} />}
              {protocol.note && <Definition label="Editoryal not" value={protocol.note} />}
            </dl>
          </Card>
        ))}
      </div>
      {content.timeToEffect && <p className="mt-4 rounded-2xl border border-[#C9A14A]/15 bg-[#C9A14A]/[0.06] px-5 py-4 text-sm leading-6 text-neutral-300"><strong className="text-[#D6B25E]">Etki süresi:</strong> {content.timeToEffect}</p>}
    </section>
  );
}

function Safety({ content }: { content: SupplementEvidenceContent }) {
  return (
    <section aria-labelledby="safety-title">
      <SectionHeading eyebrow="Safety Review" title="Güvenlik ve Dikkat Edilmesi Gerekenler" id="safety-title" />
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {content.safety && <InfoCard title="Güvenlik özeti" text={content.safety} />}
        {content.sideEffects?.length ? <ListCard title="Olası yan etkiler" items={content.sideEffects} /> : null}
        {content.cautions?.length ? <ListCard title="Dikkat edilmesi gerekenler" items={content.cautions} /> : null}
        {content.interactions?.length ? <ListCard title="Etkileşimler" items={content.interactions} /> : null}
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-[#090909] p-5 text-sm leading-7 text-neutral-400">
        <p>Bu içerik tanı veya tedavi yerine geçmez. Böbrek, karaciğer veya kalp hastalığı; hipertansiyon; gebelik veya emzirme; 18 yaş altı; düzenli ilaç kullanımı ya da klinik besin eksikliği durumunda kişisel profesyonel değerlendirme gerekir.</p>
        <p className="mt-3">Yarışan sporcular, yanlış etiketlenmiş veya kontamine ürün riskine karşı güvenilir üçüncü taraf test programlarını dikkate almalıdır.</p>
      </div>
    </section>
  );
}

function Myths({ content }: { content: SupplementEvidenceContent }) {
  if (!content.myths?.length) return null;
  return (
    <section aria-labelledby="myths-title">
      <SectionHeading eyebrow="Myth Check" title="Yaygın Yanlış Bilinenler" id="myths-title" />
      <div className="mt-6 space-y-4">
        {content.myths.map((item) => (
          <Card key={item.myth} variant="subtle" className="p-6">
            <p className="text-sm font-semibold text-white">“{item.myth}”</p>
            <p className="mt-3 text-sm leading-7 text-neutral-400">{item.answer}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Limitations({ content }: { content: SupplementEvidenceContent }) {
  if (!content.limitations?.length) return null;
  return <section aria-labelledby="limitations-title"><ListCard title="Kanıt Sınırlılıkları" id="limitations-title" items={content.limitations} /></section>;
}

function Verdict({ content }: { content: SupplementEvidenceContent }) {
  if (!content.verdict) return null;
  return (
    <section aria-labelledby="verdict-title">
      <Card variant="gold" className="p-7 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A14A]">Trainology Evidence Verdict</p>
        <h2 id="verdict-title" className="mt-3 text-2xl font-semibold text-white">Sonuç</h2>
        <p className="mt-5 max-w-4xl text-base leading-8 text-neutral-200">{content.verdict}</p>
      </Card>
    </section>
  );
}

function References({ references }: { references: readonly SupplementReference[] }) {
  if (!references.length) return null;
  return (
    <section aria-labelledby="references-title">
      <SectionHeading eyebrow="Kaynak Şeffaflığı" title="Bilimsel Kaynaklar" id="references-title" description="Claim kartlarındaki referans kimlikleri aşağıdaki doğrulanmış kaynaklara bağlanır." />
      <div className="mt-6 max-w-5xl space-y-3">
        {references.map((reference) => (
          <details key={reference.id} className="group/source rounded-2xl border border-white/10 bg-[#0A0A0A] px-5 py-4 open:border-[#C9A14A]/25">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A]">
              <span>{reference.id}</span><span aria-hidden="true" className="text-[#C9A14A] transition group-open/source:rotate-45">+</span>
            </summary>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-sm leading-7 text-neutral-400">{reference.citation}</p>
              <a href={reference.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex break-all text-sm font-medium text-[#C9A14A] hover:text-[#E0BE70] focus-visible:outline-none focus-visible:underline">Kaynağı aç →</a>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, id, description }: { eyebrow: string; title: string; id: string; description?: string }) {
  return <div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A14A]">{eyebrow}</p><h2 id={id} className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>{description && <p className="mt-3 leading-7 text-neutral-500">{description}</p>}</div>;
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return <Card variant="subtle" className="h-full p-6 sm:p-7"><h2 className="text-xl font-semibold text-white">{title}</h2><p className="mt-4 leading-8 text-neutral-300">{text}</p></Card>;
}

function ListCard({ title, items, id }: { title: string; items: readonly string[]; id?: string }) {
  return <Card variant="subtle" className="h-full p-6 sm:p-7"><h2 id={id} className="text-xl font-semibold text-white">{title}</h2><ul className="mt-5 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-neutral-400"><span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#C9A14A]" /><span>{item}</span></li>)}</ul></Card>;
}

function Definition({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">{label}</dt><dd className="mt-1.5 leading-6 text-neutral-300">{value}</dd></div>;
}

function NextSteps() {
  return (
    <section aria-labelledby="next-steps-title" className="border-t border-white/10 pt-12">
      <h2 id="next-steps-title" className="text-2xl font-semibold text-white">Sonraki Adımlar</h2>
      <p className="mt-3 text-neutral-400">Trainology araçları ve bilimsel rehberleriyle değerlendirmeyi derinleştirin.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {nextSteps.map((item) => <Card key={item.href} title={item.title} description={item.description} href={item.href} variant="subtle" className="h-full p-5" />)}
      </div>
    </section>
  );
}
