import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1RM Hesaplayıcı",
  description: "Kullanılan ağırlık ve tekrar sayısından tahmini bir tekrar maksimumunuzu hesaplayın.",
};

export default function OneRepMaxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
