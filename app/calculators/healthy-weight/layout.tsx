import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI ve Ağırlık Aralığı",
  description: "Boyunuza göre BMI temelli genel ağırlık referans aralığını inceleyin.",
  alternates: { canonical: "/calculators/healthy-weight" },
};

export default function HealthyWeightLayout({ children }: { children: React.ReactNode }) {
  return children;
}
