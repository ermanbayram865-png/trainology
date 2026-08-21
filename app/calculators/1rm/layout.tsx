import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1RM Hesaplayıcı | Tahmini Tek Tekrar Maksimumu",
  description:
    "Kaldırdığın ağırlık ve tekrar sayısından yaklaşık 1RM değerini hesapla. Kullanılan yöntem, geçerli tekrar aralığı ve belirsizlikleri açıkça gör.",
  alternates: { canonical: "/calculators/1rm" },
  openGraph: {
    title: "1RM Hesaplayıcı — Trainology",
    description:
      "Ağırlık ve tekrar sayısından yaklaşık tek tekrar maksimumunu bilimsel sınırlar içinde tahmin et.",
    url: "/calculators/1rm",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "1RM Hesaplayıcı — Trainology",
    description:
      "Ağırlık ve tekrar sayısından yaklaşık tek tekrar maksimumunu bilimsel sınırlar içinde tahmin et.",
  },
};

export default function OneRepMaxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
