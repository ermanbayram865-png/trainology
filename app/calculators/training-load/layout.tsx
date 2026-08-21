import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "%1RM Antrenman Yükü Hesaplayıcı",
  description:
    "1RM değerinin seçtiğin yüzdesini kilogram olarak hesapla; yöntemi ve belirsizlikleri açıkça gör.",
  alternates: { canonical: "/calculators/training-load" },
  openGraph: {
    title: "%1RM Antrenman Yükü Hesaplayıcı — Trainology",
    description: "1RM değerini seçtiğin yüzdeye çevir ve yaklaşık antrenman yükünü hesapla.",
    url: "/calculators/training-load",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "%1RM Antrenman Yükü Hesaplayıcı — Trainology",
    description: "1RM değerini seçtiğin yüzdeye çevir ve yaklaşık antrenman yükünü hesapla.",
  },
};

export default function TrainingLoadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
