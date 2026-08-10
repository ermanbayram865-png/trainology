import type { Metadata } from "next";

import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-12">
        <PageHeader
          badge="Hakkımızda"
          title="Trainology"
          description="Bilimsel ilkeleri anlaşılır ve uygulanabilir fitness araçlarına dönüştüren yeni nesil platform."
        />

        <Card
          title="Bilimsel yaklaşım"
          description="Kanıta dayalı yöntemleri, güvenilir hesaplama yaklaşımlarını ve anlaşılır hareket bilgilerini bir araya getiriyoruz."
          variant="subtle"
          className="max-w-2xl"
        />
      </Section>
    </main>
  );
}
