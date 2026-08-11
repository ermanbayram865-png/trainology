"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import CTAButton from "@/components/ui/CTAButton";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import { ENERGY_LAB_PATH } from "@/lib/routes";

export default function EnergyLabLegacyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ENERGY_LAB_PATH);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]">
        <div
          role="status"
          aria-live="polite"
          className="max-w-3xl rounded-3xl border border-[#C9A14A]/25 bg-[#0B0B0B] p-6 shadow-[0_20px_60px_rgba(0,0,0,.28)] sm:p-10"
        >
          <PageHeader
            title="Trainology Energy Lab'e yönlendiriliyorsunuz"
            description="Ücretsiz analiz deneyimi artık Kalori Hedefi Simülatörü içinde devam ediyor. Yönlendirme başlamazsa aşağıdaki bağlantıyı kullanabilirsiniz."
          />

          <div className="mt-8">
            <CTAButton href={ENERGY_LAB_PATH}>
              Kalori Hedefi Simülatörü’ne Git
            </CTAButton>
          </div>
        </div>
      </Section>
    </main>
  );
}
