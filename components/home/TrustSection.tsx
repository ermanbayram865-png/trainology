import { BookOpenCheck, ShieldCheck, UsersRound, Waves } from "lucide-react";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

const principles = [
  { title: "Kanıta dayalı bilgiler", icon: <BookOpenCheck aria-hidden="true" /> },
  { title: "Bilimsel kaynaklar", icon: <ShieldCheck aria-hidden="true" /> },
  { title: "Abartısız yaklaşım", icon: <Waves aria-hidden="true" /> },
  { title: "Kullanıcı odaklı sistem", icon: <UsersRound aria-hidden="true" /> },
];

export default function TrustSection() {
  return (
    <Section
      title="Neden Trainology?"
      subtitle="Yaklaşımımız"
      description="Fitness kararlarını daha güvenilir ve uygulanabilir hale getiren ilkeler."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {principles.map((principle) => (
          <Card
            key={principle.title}
            title={principle.title}
            icon={principle.icon}
            variant="subtle"
            className="p-6"
          />
        ))}
      </div>
    </Section>
  );
}
