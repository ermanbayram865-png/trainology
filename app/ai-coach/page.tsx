import CTAButton from "@/components/ui/CTAButton";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

export default function AICoachPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-12">
        <PageHeader
          badge="AI Coach"
          title="AI Coach"
          description="Kişiselleştirilmiş antrenman ve beslenme önerileri yakında burada olacak."
        />

        <EmptyState
          title="AI Coach hazırlanıyor"
          description="Bu alan, hedeflerine uygun bilimsel yönlendirmeler sunmak için geliştiriliyor."
          button={
            <CTAButton href="/calculators" variant="secondary">
              Bilimsel Araçları Keşfet
            </CTAButton>
          }
          className="max-w-2xl"
        />
      </Section>
    </main>
  );
}
