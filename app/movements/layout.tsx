import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/movements",
  },
};

export default function MovementsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
