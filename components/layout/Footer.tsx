import Image from "next/image";
import Link from "next/link";

import Container from "@/components/ui/Container";

const platformLinks = [
  { label: "Hesaplayıcılar", href: "/calculators" },
  { label: "Hareket Kütüphanesi", href: "/movements" },
  { label: "Supplementler", href: "/supplements" },
  { label: "AI Coach", href: "/ai-coach" },
];

const knowledgeLinks = [
  { label: "Scientific Library", href: "/articles" },
  { label: "Hakkımızda", href: "/about" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <Container>
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-4">
              <Image src="/images/logo.png" alt="Trainology" width={48} height={48} />
              <div>
                <p className="text-xl font-bold tracking-[0.18em] text-white">
                  TRAINOLOGY
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C9A14A]">
                  Bilimsel Fitness Platformu
                </p>
              </div>
            </Link>

            <p className="mt-6 text-sm leading-7 text-neutral-400">
              Beslenme, antrenman ve performans bilgisini bilimsel kanıtlarla anlaşılır hale getirir.
            </p>
          </div>

          <FooterLinkGroup title="Platform" links={platformLinks} />
          <FooterLinkGroup title="Bilgi Merkezi" links={knowledgeLinks} />
          <FooterLinkGroup
            title="Başlangıç"
            links={[{ label: "Ücretsiz Analiz", href: "/analysis" }]}
          />
        </div>

        <div className="border-t border-white/5 py-8">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A14A]/80">
            Yasal Uyarı
          </h3>
          <div className="mt-4 max-w-4xl space-y-2 text-xs leading-6 text-neutral-500">
            <p>Trainology içerikleri eğitim ve bilgilendirme amacıyla hazırlanmıştır.</p>
            <p>Sunulan bilgiler profesyonel sağlık tavsiyesi, tanı veya tedavi yerine geçmez.</p>
            <p>Hesaplama araçları genel bilgilendirme amaçlı tahminler sunar. Sonuçlar kişisel faktörlere göre değişebilir.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/5 py-7 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Trainology</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>Gizlilik Politikası</span>
            <span>Kullanım Koşulları</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

type FooterLinkGroupProps = {
  title: string;
  links: readonly { label: string; href: string }[];
};

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A14A]">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-neutral-400 transition-colors hover:text-[#C9A14A]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
