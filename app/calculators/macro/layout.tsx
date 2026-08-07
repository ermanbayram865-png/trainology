import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Makro Hesaplayıcı",
  description: "Günlük kalori hedefi, aktivite ve hedefe göre makro dağılımı için genel bir öneri alın.",
  alternates: { canonical: "/calculators/macro" },
};

export default function MacroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
