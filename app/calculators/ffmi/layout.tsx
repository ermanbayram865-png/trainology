import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yağsız Kütle İndeksi (FFMI)",
  description: "Boy, kilo ve vücut yağ oranından tahmini FFMI, yağsız kütle ve yağ kütlesi göstergelerini hesaplayın.",
  alternates: { canonical: "/calculators/ffmi" },
  openGraph: {
    title: "Yağsız Kütle İndeksi (FFMI) | Trainology",
    description:
      "Boy, kilo ve vücut yağ oranından tahmini FFMI, yağsız kütle ve yağ kütlesi göstergelerini hesaplayın.",
    type: "website",
    url: "/calculators/ffmi/",
    images: ["/images/hero/trainology-hero-object.png"],
  },
};

export default function FfmiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
