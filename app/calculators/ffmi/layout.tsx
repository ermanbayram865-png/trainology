import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FFMI Hesaplayıcı",
  description: "Boy, kilo ve vücut yağ oranına göre yağsız kütle ve FFMI değerini genel olarak inceleyin.",
  alternates: { canonical: "/calculators/ffmi" },
};

export default function FfmiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
