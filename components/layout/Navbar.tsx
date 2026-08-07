"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const menuItems = [
  { title: "Ana Sayfa", href: "/" },
  { title: "Hesaplayıcılar", href: "/calculators" },
  { title: "Hareket Kütüphanesi", href: "/movements" },
  { title: "Science", href: "/articles" },
  { title: "Supplementler", href: "/supplements" },
  { title: "AI Coach", href: "/ai-coach" },
  { title: "Hakkımızda", href: "/about" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur">
      <Container>
        <div className="flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/images/logo.png"
              alt="Trainology"
              width={48}
              height={48}
              priority
            />

            <div className="hidden sm:block">
              <h2 className="text-2xl font-bold tracking-[0.18em]">
                TRAINOLOGY
              </h2>

              <p className="mt-1 text-[11px] uppercase tracking-[0.30em] text-[#C9A14A]">
                Bilimsel Fitness Platformu
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-medium text-zinc-300 transition-all duration-300 hover:text-[#C9A14A] after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-[#C9A14A] after:transition-all hover:after:w-full"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="/analysis">Ücretsiz Analiz</Button>
          </div>

          <button
            type="button"
            aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 p-3 text-white transition hover:border-[#C9A14A] hover:text-[#C9A14A] lg:hidden"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="border-t border-white/10 py-6 lg:hidden">
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-zinc-300 transition hover:text-[#C9A14A]"
                >
                  {item.title}
                </Link>
              ))}

              <Button href="/analysis" onClick={() => setIsMenuOpen(false)}>
                Ücretsiz Analiz
              </Button>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}
