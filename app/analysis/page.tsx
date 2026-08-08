import type { Metadata } from "next";

import AnalysisExperience from "@/features/analysis/AnalysisExperience";

export const metadata: Metadata = {
  title: "Ücretsiz Fitness Analizi",
  description: "BMI, kalori, protein, makro, su ihtiyacı ve hedef odaklı fitness özetinizi ücretsiz olarak hesaplayın.",
  alternates: { canonical: "/analysis" },
};

export default function AnalysisPage() { return <AnalysisExperience />; }
