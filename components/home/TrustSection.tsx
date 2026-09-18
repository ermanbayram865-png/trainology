import Section from "@/components/ui/Section";

const principles = [
  {
    title: "Kanıta Dayalı Bilgi",
    description:
      "Enerji, beslenme ve vücut ölçümü hesaplarını güncel bilimsel yaklaşımlar üzerinden değerlendiririz.",
  },
  {
    title: "Bilimsel Editörlük",
    description:
      "Araçlar ve açıklamalar doğruluk, yöntem kalitesi ve bilimsel standartlar gözetilerek hazırlanır.",
  },
  {
    title: "Abartısız Yaklaşım",
    description:
      "Hızlı sonuç vaatleri yerine sürdürülebilir ve gerçekçi çözümler sunarız.",
  },
  {
    title: "Kullanıcı Odaklı Sistem",
    description:
      "Karmaşık fitness bilgisini herkesin uygulayabileceği sistemlere dönüştürürüz.",
  },
];

export default function TrustSection() {
  return (
    <Section
      subtitle="YAKLAŞIMIMIZ"
      title="Neden Trainology?"
      description="Fitness bilgisini daha güvenilir, anlaşılır ve uygulanabilir hale getiren bilimsel yaklaşım."
      className="bg-[var(--site-surface)] !py-[var(--space-section-compact)]"
      contentClassName="mt-4"
    >
      <ol className="grid border-t border-[var(--border-dark)] md:grid-cols-2">
        {principles.map((principle, index) => (
          <li key={principle.title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-[var(--border-dark)] py-7 md:odd:pr-8 md:even:border-l md:even:pl-8">
            <span className="font-mono text-xs text-[var(--brand-gold)]">0{index + 1}</span>
            <div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">{principle.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--site-text-secondary)]">{principle.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
