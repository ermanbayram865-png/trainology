import Badge from "@/components/ui/Badge";
import CTAButton from "@/components/ui/CTAButton";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

export default function AICoachComingSoon() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="max-w-3xl">
        <PageHeader
          badge={<Badge variant="gold">YAKINDA</Badge>}
          title="Trainology AI Coach"
          description="Bilimsel fitness bilgisini kişisel hedeflerinle buluşturan yapay zekâ destekli koç deneyimi üzerinde çalışıyoruz."
        />

        <p className="max-w-2xl text-base leading-8 text-neutral-400 sm:text-lg">
          Antrenman, beslenme, supplement ve toparlanma konularında kanıta dayalı rehberlik sunacak.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <CTAButton href="/" className="w-full sm:w-auto">
            Platformu Keşfet
          </CTAButton>
          <CTAButton href="/articles" variant="secondary" className="w-full sm:w-auto">
            Bilimsel İçerikleri Keşfet
          </CTAButton>
        </div>
      </Section>
    </main>
  );
}
