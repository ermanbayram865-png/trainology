"use client";

import { Send } from "lucide-react";
import { useState } from "react";

const quickActions = ["Bugün ne yemeliyim?", "Bana antrenman oluştur", "Kreatini açıkla", "Ne kadar protein almalıyım?", "Programımı analiz et"];

type ChatComposerProps = { onSend: (content: string) => Promise<void>; disabled: boolean };

export default function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [value, setValue] = useState("");

  async function submit() {
    if (!value.trim()) return;
    const message = value;
    setValue("");
    await onSend(message);
  }

  return (
    <div className="sticky bottom-0 pt-5">
      <div className="rounded-2xl border border-white/10 bg-[#101010]/95 p-3 shadow-[0_-12px_32px_rgba(0,0,0,.12)] backdrop-blur">
        <textarea value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submit(); } }} placeholder="Hedefin veya sorunu yaz…" aria-label="AI Coach mesajı" rows={2} className="w-full resize-none bg-transparent px-2 py-1 text-sm leading-6 text-white outline-none placeholder:text-neutral-500" />
        <div className="mt-2 flex items-center justify-between gap-3"><span className="hidden text-xs text-neutral-500 sm:block">Enter gönderir · Shift + Enter yeni satır</span><button type="button" onClick={() => void submit()} disabled={disabled || !value.trim()} aria-label="Mesaj gönder" className="ml-auto inline-flex size-10 items-center justify-center rounded-xl bg-[#C9A14A] text-black transition hover:bg-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"><Send className="size-4" /></button></div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Hızlı sorular">{quickActions.map((action) => <button key={action} type="button" onClick={() => setValue(action)} className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-[#C9A14A]/40 hover:text-[#C9A14A]">{action}</button>)}</div>
    </div>
  );
}
