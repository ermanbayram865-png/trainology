import { BookOpenCheck, ShieldCheck, UsersRound, Waves } from "lucide-react";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

const principles = [
  {
    title: "Kanıta Dayalı Bilgi",
    description:
      "Enerji, beslenme ve vücut ölçümü hesaplarını güncel bilimsel yaklaşımlar üzerinden değerlendiririz.",
    icon: <BookOpenCheck aria-hidden="true" />,
  },
  {
    title: "Bilimsel Editörlük",
    description:
      "Araçlar ve açıklamalar doğruluk, yöntem kalitesi ve bilimsel standartlar gözetilerek hazırlanır.",
    icon: <ShieldCheck aria-hidden="true" />,
  },
  {
    title: "Abartısız Yaklaşım",
    description:
      "Hızlı sonuç vaatleri yerine sürdürülebilir ve gerçekçi çözümler sunarız.",
    icon: <Waves aria-hidden="true" />,
  },
  {
    title: "Kullanıcı Odaklı Sistem",
    description:
      "Karmaşık fitness bilgisini herkesin uygulayabileceği sistemlere dönüştürürüz.",
    icon: <UsersRound aria-hidden="true" />,
  },
];

export default function TrustSection() {
  return (
    <Section
      subtitle="YAKLAŞIMIMIZ"
      title="Neden Trainology?"
      description="Fitness bilgisini daha güvenilir, anlaşılır ve uygulanabilir hale getiren bilimsel yaklaşım."
      contentClassName="mt-8"
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {principles.map((principle) => (
          <Card
            key={principle.title}
            title={principle.title}
            description={principle.description}
            icon={principle.icon}
            variant="subtle"
            className="p-6"
          />
        ))}
      </div>
    </Section>
  );
}
