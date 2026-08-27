import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vücut Kitle İndeksi (BMI) ve Ağırlık Aralığı",
  description: "Boyunuza göre Vücut Kitle İndeksi (BMI) temelli genel ağırlık referans aralığını inceleyin.",
  alternates: { canonical: "/calculators/healthy-weight" },
};

export default function HealthyWeightLayout({ children }: { children: React.ReactNode }) {
  return children;
}
