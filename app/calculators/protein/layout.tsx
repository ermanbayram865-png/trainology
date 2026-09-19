import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Günlük Protein Referansı",
  description: "Kilonuz, hedefiniz ve antrenman durumunuza göre günlük protein başlangıç referansını veya pratik aralığı inceleyin.",
  alternates: { canonical: "/calculators/protein" },
  openGraph: {
    title: "Günlük Protein Referansı | Trainology",
    description:
      "Kilonuz, hedefiniz ve antrenman durumunuza göre günlük protein başlangıç referansını veya pratik aralığını inceleyin.",
    type: "website",
    url: "/calculators/protein/",
    images: ["/images/hero/trainology-hero-object.png"],
  },
};

export default function ProteinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
