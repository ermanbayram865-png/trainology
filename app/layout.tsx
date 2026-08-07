import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { absoluteUrl, siteConfig } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Trainology | Bilimsel Fitness Platformu",
    template: "%s | Trainology",
  },
  description:
    "Kanıt temelli fitness rehberleri, hesaplayıcılar ve bilimsel antrenman içerikleri.",
  openGraph: {
    title: "Trainology | Bilimsel Fitness Platformu",
    description:
      "Kanıt temelli fitness rehberleri, hesaplayıcılar ve bilimsel antrenman içerikleri.",
    type: "website",
    locale: "tr_TR",
    siteName: siteConfig.name,
    url: absoluteUrl("/"),
    images: [
      {
        url: absoluteUrl(siteConfig.defaultOpenGraphImage),
        alt: "Trainology Bilimsel Fitness Platformu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trainology | Bilimsel Fitness Platformu",
    description:
      "Kanıt temelli fitness rehberleri, hesaplayıcılar ve bilimsel antrenman içerikleri.",
    images: [absoluteUrl(siteConfig.defaultOpenGraphImage)],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}
