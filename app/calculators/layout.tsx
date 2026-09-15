import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bilimsel Hesaplayıcılar",
  description:
    "Trainology hesaplayıcılarıyla enerji, makro, protein ve vücut kompozisyonu için genel tahminleri inceleyin.",
  alternates: {
    canonical: "/calculators",
  },
};

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
