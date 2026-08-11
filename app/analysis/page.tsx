import type { Metadata } from "next";

import EnergyLabLegacyRedirect from "@/components/energy-lab/EnergyLabLegacyRedirect";
import { ENERGY_LAB_PATH } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Trainology Energy Lab",
  description:
    "Ücretsiz analiz deneyimi Trainology Energy Lab Kalori Hedefi Simülatörü içinde devam ediyor.",
  alternates: { canonical: ENERGY_LAB_PATH },
  robots: { index: false, follow: true },
};

export default function AnalysisPage() {
  return <EnergyLabLegacyRedirect />;
}
