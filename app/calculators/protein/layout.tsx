import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protein Hesaplayıcı",
  description: "Hedef ve aktivite seviyesine göre günlük protein ihtiyacınız için genel bir tahmin alın.",
  alternates: { canonical: "/calculators/protein" },
};

export default function ProteinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
