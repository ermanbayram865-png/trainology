import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-12">
        <PageHeader
          badge="Hakkımızda"
          title="Trainology"
          description="Bilimsel araştırmaları herkesin anlayabileceği şekilde sunan yeni nesil fitness platformu."
        />

        <Card
          title="Bilimsel yaklaşım"
          description="Kanıta dayalı içerikleri, güvenilir kaynakları ve anlaşılır rehberleri bir araya getiriyoruz."
          variant="subtle"
          className="max-w-2xl"
        />
      </Section>
    </main>
  );
}
