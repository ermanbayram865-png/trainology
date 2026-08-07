"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl border border-white/10 bg-[#111] px-4 py-3" aria-label="AI Coach yanıt yazıyor" role="status">
      {[0, 1, 2].map((dot) => <motion.span key={dot} className="size-1.5 rounded-full bg-[#C9A14A]" animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: dot * 0.15 }} />)}
    </div>
  );
}

export function ChatLoadingSkeleton() {
  return (
    <div className="w-full max-w-3xl animate-pulse rounded-2xl border border-white/5 bg-[#111] p-5" aria-hidden="true">
      <div className="h-3 w-28 rounded bg-white/10" />
      <div className="mt-5 h-3 w-full rounded bg-white/5" />
      <div className="mt-3 h-3 w-4/5 rounded bg-white/5" />
      <div className="mt-6 h-12 rounded-xl bg-white/[0.03]" />
    </div>
  );
}
