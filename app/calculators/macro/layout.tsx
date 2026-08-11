import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Makro Planlayıcı",
  description:
    "Günlük kalori hedefi, vücut ağırlığı, aktivite ve hedefe göre protein, karbonhidrat ve yağ dağılımı planlayın.",
  alternates: { canonical: "/calculators/macro" },
};

export default function MacroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
