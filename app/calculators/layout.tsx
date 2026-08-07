import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bilimsel Hesaplayıcılar",
  description:
    "Trainology bilimsel hesaplayıcılarıyla enerji, protein, performans ve vücut kompozisyonu için genel tahminleri inceleyin.",
};

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
