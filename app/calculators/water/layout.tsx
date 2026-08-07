import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Su İhtiyacı Hesaplayıcı",
  description: "Kilo ve aktivite seviyesine göre günlük tahmini su ihtiyacınızı genel bilgilendirme amacıyla inceleyin.",
};

export default function WaterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
