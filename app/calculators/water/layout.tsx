import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toplam Su Alımı Referansı",
  description: "EFSA'nın sağlıklı yetişkinler için toplam su yeterli alım referansını inceleyin.",
  alternates: { canonical: "/calculators/water" },
};

export default function WaterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
