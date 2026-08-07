import type { Metadata } from "next";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import PerformanceAnalysis from "@/features/performance-analysis/PerformanceAnalysis";

export const metadata: Metadata = {
  title: "Performans Analizi",
  description:
    "Antrenman performansını, tahmini 1RM değerlerini ve kuvvet dağılımını tek yerde analiz et.",
  alternates: { canonical: "/calculators/performance" },
};

export default function PerformanceCalculatorPage() {
  return (
    <CalculatorLayout
      title="Performans Analizi"
      description="Antrenman performansını, tahmini 1RM değerlerini ve kuvvet dağılımını tek yerde analiz et."
      seoPath="/calculators/performance"
      disclaimer="Bu araç eğitim ve genel bilgilendirme amacıyla tahmin sunar. Sonuçlar kullanılan yük, teknik, ölçüm koşulları ve bireysel faktörlere göre değişebilir."
    >
      <PerformanceAnalysis />
    </CalculatorLayout>
  );
}
