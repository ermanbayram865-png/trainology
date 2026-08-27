import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Günlük Protein Referansı",
  description: "Kilonuz, hedefiniz ve antrenman durumunuza göre günlük protein başlangıç referansını veya pratik aralığı inceleyin.",
  alternates: { canonical: "/calculators/protein" },
};

export default function ProteinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
