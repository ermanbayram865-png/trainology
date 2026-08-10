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
    "Kanıt temelli fitness hesaplayıcıları, performans analizi ve hareket kütüphanesi.",
  openGraph: {
    title: "Trainology | Bilimsel Fitness Platformu",
    description:
      "Kanıt temelli fitness hesaplayıcıları, performans analizi ve hareket kütüphanesi.",
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
      "Kanıt temelli fitness hesaplayıcıları, performans analizi ve hareket kütüphanesi.",
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
        <div
          aria-hidden="true"
          className="fixed inset-0 z-0 bg-[url('/images/backgrounds/site-bg.png')] bg-cover bg-[center_top] bg-no-repeat"
        />
        <div aria-hidden="true" className="fixed inset-0 z-[1] bg-black/55" />

        <div className="relative z-10">
          <Navbar />

          {children}

          <Footer />
        </div>
      </body>
    </html>
  );
}
