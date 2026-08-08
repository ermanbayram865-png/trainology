"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import InstagramIcon from "@/components/ui/InstagramIcon";

type ShareActionsProps = { url: string };

export default function ShareActions({ url }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Bağlantıyı kopyalayın:", url);
    }
  }

  const buttonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 text-sm font-medium text-neutral-300 transition hover:border-[#C9A14A]/50 hover:text-[#D6B25E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A]";

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Makale paylaşım seçenekleri">
      <button type="button" onClick={copyLink} className={buttonClass} aria-label="Makale bağlantısını kopyala">{copied ? <Check aria-hidden="true" className="size-4 text-[#C9A14A]" /> : <Copy aria-hidden="true" className="size-4" />}{copied ? "Kopyalandı" : "Linki Kopyala"}</button>
      <a href="https://www.instagram.com/trainologyfit/" target="_blank" rel="noreferrer" className={buttonClass} aria-label="Trainology Instagram profilini aç"><InstagramIcon className="size-4" />@trainologyfit</a>
    </div>
  );
}
