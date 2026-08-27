import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Su & Hidrasyon",
  description: "Günlük toplam su referansını görüntüleyin ve egzersiz hidrasyonunu ölçüme dayalı olarak değerlendirin.",
  alternates: { canonical: "/calculators/water" },
};

export default function WaterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
