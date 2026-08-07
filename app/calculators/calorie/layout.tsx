import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalori Hesaplayıcı",
  description: "Mifflin–St Jeor denklemi ve aktivite seviyesine göre günlük enerji ihtiyacını tahmin edin.",
};

export default function CalorieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
