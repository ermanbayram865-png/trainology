import type { Metadata } from "next";
import Image from "next/image";
import {
  BarChart3,
  BookOpenCheck,
  Calculator,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Target,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";
import { ENERGY_LAB_PATH } from "@/lib/routes";

export const metadata: Metadata = {
  title: { absolute: "Hakkımızda | Trainology" },
  description:
    "Trainology’nin bilimsel fitness yaklaşımını, misyonunu, kalite ilkelerini ve kullanıcıların daha bilinçli antrenman kararları almasına yardımcı olan araçlarını keşfedin.",
  alternates: { canonical: "/about" },
};

const approaches = [
  {
    title: "Bilimsel Dayanak",
    description:
      "Önerilerimizi güncel bilimsel bilgi, yerleşik antrenman prensipleri ve güvenilir kaynaklar doğrultusunda şekillendiririz. Kanıtın sınırlarını aşan kesin vaatlerden kaçınırız.",
    icon: <BookOpenCheck aria-hidden="true" />,
  },
  {
    title: "Sade ve Anlaşılır",
    description:
      "Karmaşık kavramları anlamını bozmadan, gereksiz teknik yük oluşturmadan açıklarız. Kullanıcının bilgiyi hızlıca anlayıp uygulayabilmesini önemseriz.",
    icon: <ShieldCheck aria-hidden="true" />,
  },
  {
    title: "Uygulama Odaklı",
    description:
      "Bilginin gerçek değeri, doğru karara dönüşebilmesidir. Bu nedenle araçlarımızı ve açıklamalarımızı günlük antrenman pratiğinde kullanılabilecek şekilde tasarlarız.",
    icon: <Target aria-hidden="true" />,
  },
] as const;

const platformFeatures = [
  {
    title: "Hesaplama Araçları",
    description:
      "Energy Lab, protein, makro ve FFMI ölçümlerini pratik biçimde değerlendirmeye yardımcı olan araçlar.",
    icon: <Calculator aria-hidden="true" />,
    cta: "Araçları Keşfet",
    href: "/calculators",
  },
  {
    title: "Trainology Energy Lab",
    description:
      "Günlük enerji ihtiyacın ve hedefin için kontrollü bir başlangıç tahmini oluşturmana yardımcı olur.",
    icon: <BarChart3 aria-hidden="true" />,
    cta: "Ücretsiz Analize Başla",
    href: ENERGY_LAB_PATH,
  },
] as const;

const qualityPrinciples = [
  "Bilimsel doğruluk",
  "Kullanıcıya gerçek fayda",
  "Açık ve anlaşılır iletişim",
  "Abartısız ve sorumlu yönlendirme",
  "Sürekli gözden geçirme ve iyileştirme",
  "Uzun vadeli marka güveni",
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <Section className="relative overflow-hidden border-b border-white/5 py-16 sm:py-20 lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-96 rounded-full bg-[#C9A14A]/10 blur-3xl" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
          <div className="max-w-4xl">
            <Badge variant="gold">HAKKIMIZDA</Badge>
            <h1 className="mt-7 text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              Bilgiyi Antrenmana Dönüştüren Bilimsel Fitness Platformu
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-neutral-300 sm:text-lg">
              Trainology; fitness alanındaki karmaşık bilgileri anlaşılır, uygulanabilir ve ölçülebilir hâle getirmek amacıyla geliştirilen bağımsız bir platformdur. Hesaplama araçlarıyla kullanıcıların daha bilinçli kararlar almasına yardımcı olur.
            </p>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-[22rem] items-center justify-center overflow-hidden rounded-[2rem] border border-[#C9A14A]/25 bg-[radial-gradient(circle_at_center,rgba(201,161,74,.16),transparent_62%),#090909] shadow-[0_30px_80px_rgba(0,0,0,.38)]">
            <div aria-hidden="true" className="absolute inset-8 rounded-full border border-[#C9A14A]/10" />
            <Image
              src="/images/logo.png"
              alt="Trainology logosu"
              width={176}
              height={176}
              priority
              className="relative size-36 object-contain sm:size-44"
            />
          </div>
        </div>
      </Section>

      <Section subtitle="MİSYON" title="Misyonumuz">
        <div className="max-w-5xl rounded-3xl border border-[#C9A14A]/20 bg-[linear-gradient(135deg,rgba(201,161,74,.08),rgba(10,10,10,.92)_48%)] p-7 shadow-[0_24px_70px_rgba(0,0,0,.24)] sm:p-10">
          <p className="max-w-4xl text-base leading-8 text-neutral-300 sm:text-lg">
            Fitness bilgisini yalnızca okunacak bir içerik olmaktan çıkarıp günlük antrenman kararlarında kullanılabilecek pratik bir kaynağa dönüştürmek istiyoruz. Amacımız; bilimsel doğruluğu, sade anlatımı ve kullanıcıya gerçek faydayı aynı sistem içinde buluşturmaktır.
          </p>
        </div>
      </Section>

      <Section
        className="bg-[#080808]"
        subtitle="YAKLAŞIMIMIZ"
        title="Bilimsel, anlaşılır ve uygulamaya dönük."
        description="Trainology’de her araç ve açıklama aynı üç temel yaklaşım üzerine kurulur."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {approaches.map((approach) => (
            <Card key={approach.title} {...approach} variant="gold" className="h-full" />
          ))}
        </div>
      </Section>

      <Section
        subtitle="PLATFORM"
        title="Trainology’de Neler Var?"
        description="Mevcut araçlar, antrenman bilgisini ölçülebilir ve uygulanabilir kararlara dönüştürmeye yardımcı olur."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {platformFeatures.map((feature) => (
            <Card key={feature.title} title={feature.title} description={feature.description} icon={feature.icon} variant="subtle" className="flex h-full flex-col" childrenClassName="mt-auto pt-7">
              <CTAButton href={feature.href} variant="secondary" className="w-full">
                {feature.cta}
              </CTAButton>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-[#080808]" subtitle="STANDARTLARIMIZ" title="Kalite İlkelerimiz">
        <div className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-7 shadow-[0_24px_70px_rgba(0,0,0,.24)] sm:p-10">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {qualityPrinciples.map((principle) => (
              <li key={principle} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-sm leading-6 text-neutral-300">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#C9A14A]" />
                <span>{principle}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-white/10 pt-7 text-base leading-8 text-neutral-300">
            Trainology’de kısa vadeli etkileşim uğruna bilimsel doğruluk veya kullanıcı güveninden ödün verilmez.
          </p>
        </div>
      </Section>

      <Section subtitle="SORUMLU YAKLAŞIM" title="Trainology Ne Sunmaz?">
        <div className="max-w-5xl rounded-3xl border border-[#C9A14A]/25 bg-[#C9A14A]/[0.055] p-7 sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <ShieldCheck aria-hidden="true" className="size-8 shrink-0 text-[#D6B25E]" />
            <p className="text-base leading-8 text-neutral-300">
              Trainology genel bilgilendirme ve eğitim amacıyla hazırlanmıştır. Tıbbi tanı, tedavi, kişiye özel sağlık değerlendirmesi veya profesyonel koçluk hizmetinin yerini almaz. Sağlık sorunu, sakatlık, özel beslenme ihtiyacı veya ilaç kullanımı bulunan kişiler uygun bir sağlık profesyoneline danışmalıdır.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-[#080808]" subtitle="BAĞIMSIZLIK" title="Bağımsız Bir Proje">
        <Card variant="subtle" className="max-w-5xl">
          <p className="text-base leading-8 text-neutral-300 sm:text-lg">
            Trainology, kullanıcıların daha bilinçli fitness kararları almasına yardımcı olmak amacıyla geliştirilen bağımsız bir projedir. Platformda yer alan açıklamalar, araçlar ve değerlendirmeler belirli bir ürünün satışını teşvik etmek amacıyla hazırlanmamıştır.
          </p>
        </Card>
      </Section>

      <Section className="pb-24 sm:pb-28" subtitle="İLETİŞİM" title="Bizimle İletişime Geçin">
        <div className="relative max-w-5xl overflow-hidden rounded-[2rem] border border-[#C9A14A]/30 bg-[radial-gradient(circle_at_top_right,rgba(201,161,74,.18),transparent_46%),#0A0A0A] p-7 shadow-[0_28px_80px_rgba(0,0,0,.32)] sm:p-10">
          <Mail aria-hidden="true" className="size-8 text-[#D6B25E]" />
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            Geri bildirim, hata bildirimi, içerik önerisi ve diğer sorularınız için bize e-posta gönderebilirsiniz.
          </p>
          <a href="mailto:trainology.fit@outlook.com" className="mt-5 inline-block break-all text-lg font-semibold text-[#D6B25E] transition-colors hover:text-[#E7CA84] focus-visible:outline-none focus-visible:underline">
            trainology.fit@outlook.com
          </a>
          <div className="mt-8">
            <CTAButton href="mailto:trainology.fit@outlook.com">E-posta Gönder</CTAButton>
          </div>
        </div>
      </Section>
    </main>
  );
}
