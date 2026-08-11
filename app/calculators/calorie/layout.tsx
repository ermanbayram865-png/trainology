import type { Metadata } from "next";

import { ENERGY_LAB_PATH } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Kalori Hedefi Simülatörü — Energy Lab",
  description:
    "NASEM 2023 ile bakım kalorisi ve günlük enerji ihtiyacı için başlangıç tahmini oluşturun; kontrollü kalori hedefinizi seçip ağırlık trendiyle değerlendirin.",
  alternates: { canonical: ENERGY_LAB_PATH },
  openGraph: {
    title: "Kalori Hedefi Simülatörü | Trainology Energy Lab",
    description:
      "Enerji ihtiyacını tahmin et, hedefini seç ve gerçek ağırlık trendinle değerlendir.",
    url: ENERGY_LAB_PATH,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1734,
        height: 907,
        alt: "Trainology Energy Lab 2.0 — Kalori Hedefi Simülatörü",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalori Hedefi Simülatörü | Trainology Energy Lab",
    description:
      "Enerji ihtiyacını tahmin et, hedefini seç ve gerçek ağırlık trendinle değerlendir.",
    images: ["/og.png"],
  },
};

export default function CalorieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
