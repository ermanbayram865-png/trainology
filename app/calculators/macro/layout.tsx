import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Makro Planlayıcı",
  description:
    "Günlük kalori hedefini vücut ağırlığı, boy, hedef ve direnç antrenmanı bağlamıyla başlangıç makro dağılımına dönüştürün.",
  alternates: { canonical: "/calculators/macro" },
};

export default function MacroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
