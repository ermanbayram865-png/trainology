import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protein İhtiyacı",
  description: "Yetişkinler için protein nüfus referansını veya antrenmana göre pratik protein aralığını inceleyin.",
  alternates: { canonical: "/calculators/protein" },
};

export default function ProteinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
