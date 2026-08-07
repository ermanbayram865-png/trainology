"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

type ShareActionsProps = { title: string; url: string };

export default function ShareActions({ title, url }: ShareActionsProps) {
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

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await copyLink();
  }

  const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const buttonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 text-sm font-medium text-neutral-300 transition hover:border-[#C9A14A]/50 hover:text-[#D6B25E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A]";

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Makale paylaşım seçenekleri">
      <button type="button" onClick={copyLink} className={buttonClass} aria-label="Makale bağlantısını kopyala">{copied ? <Check aria-hidden="true" className="size-4 text-[#C9A14A]" /> : <Copy aria-hidden="true" className="size-4" />}{copied ? "Kopyalandı" : "Linki Kopyala"}</button>
      <a href={xUrl} target="_blank" rel="noreferrer" className={buttonClass} aria-label="Makaleyi X üzerinde paylaş">X</a>
      <a href={whatsappUrl} target="_blank" rel="noreferrer" className={buttonClass} aria-label="Makaleyi WhatsApp üzerinden paylaş">WhatsApp</a>
      <button type="button" onClick={nativeShare} className={buttonClass} aria-label="Makaleyi paylaş"><Share2 aria-hidden="true" className="size-4" />Paylaş</button>
    </div>
  );
}
