import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Makro Planlayıcı",
  description:
    "Günlük kalori hedefini vücut ağırlığı, boy, hedef ve direnç antrenmanı durumuna göre başlangıç makro dağılımına dönüştürün.",
  alternates: { canonical: "/calculators/macro" },
  openGraph: {
    title: "Makro Planlayıcı | Trainology",
    description:
      "Günlük kalori hedefini vücut ağırlığı, boy, hedef ve direnç antrenmanı durumuna göre başlangıç makro dağılımına dönüştürün.",
    type: "website",
    url: "/calculators/macro/",
    images: ["/images/hero/trainology-hero-object.png"],
  },
};

export default function MacroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
