import type { Metadata } from "next";

import { ENERGY_LAB_PATH } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Kalori Hedefi Simülatörü — Energy Lab",
  description:
    "Günlük enerji ihtiyacınızı tahmin edin ve hedefinize uygun kontrollü bir kalori başlangıcı oluşturun.",
  alternates: { canonical: ENERGY_LAB_PATH },
  openGraph: {
    title: "Kalori Hedefi Simülatörü | Trainology Energy Lab",
    description:
      "Enerji ihtiyacını tahmin et, hedefini seç ve kontrollü bir başlangıç noktası oluştur.",
    url: ENERGY_LAB_PATH,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1734,
        height: 907,
        alt: "Trainology Energy Lab — Kalori Hedefi Simülatörü",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalori Hedefi Simülatörü | Trainology Energy Lab",
    description:
      "Enerji ihtiyacını tahmin et, hedefini seç ve kontrollü bir başlangıç noktası oluştur.",
    images: ["/og.png"],
  },
};

export default function CalorieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
