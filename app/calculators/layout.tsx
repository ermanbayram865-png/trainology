import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bilimsel Hesaplayıcılar",
  description:
    "Trainology hesaplayıcılarıyla enerji, makro, protein ve vücut kompozisyonu için genel tahminleri inceleyin.",
  alternates: {
    canonical: "/calculators",
  },
  openGraph: {
    title: "Bilimsel Hesaplayıcılar | Trainology",
    description:
      "Trainology hesaplayıcılarıyla enerji, makro, protein ve vücut kompozisyonu için genel tahminleri inceleyin.",
    type: "website",
    url: "/calculators/",
    images: ["/images/hero/trainology-hero-object.png"],
  },
};

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
