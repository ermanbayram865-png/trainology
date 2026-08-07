import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sağlıklı Ağırlık Aralığı Hesaplayıcı",
  description: "Boyunuza göre tahmini sağlıklı ağırlık aralığını genel bir referans olarak inceleyin.",
};

export default function HealthyWeightLayout({ children }: { children: React.ReactNode }) {
  return children;
}
