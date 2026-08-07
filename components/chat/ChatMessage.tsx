"use client";

import { Check, Clipboard, Pencil, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import SourceCard from "@/components/source/SourceCard";
import { AnswerCard, BulletList, ExpandableSection, InfoCallout, SummaryBox } from "@/components/chat/ResponseComponents";
import type { ChatMessage as ChatMessageData } from "@/types/chat";

type ChatMessageProps = {
  message: ChatMessageData;
  onEdit: (messageId: string, content: string) => void;
  onRegenerate: (messageId: string) => void;
};

export default function ChatMessage({ message, onEdit, onRegenerate }: ChatMessageProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const isAssistant = message.role === "assistant";

  async function copyAnswer() {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1500);
  }

  function saveEdit() {
    const content = draft.trim();
    if (content) onEdit(message.id, content);
    setIsEditing(false);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={isAssistant ? "max-w-3xl" : "ml-auto max-w-2xl"}
    >
      <div className={isAssistant ? "space-y-3" : "rounded-2xl bg-[#C9A14A] px-5 py-4 text-sm leading-6 text-black"}>
        {isAssistant ? (
          <AnswerCard>
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C9A14A]">Trainology AI Coach</p><p className="mt-1 text-xs text-neutral-500">{new Date(message.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</p></div>
              <div className="flex items-center gap-1"><ActionButton label="Yanıtı kopyala" onClick={copyAnswer}>{isCopied ? <Check className="size-4" /> : <Clipboard className="size-4" />}</ActionButton><ActionButton label="Yanıtı yeniden oluştur" onClick={() => onRegenerate(message.id)}><RefreshCw className="size-4" /></ActionButton></div>
            </div>
            {message.answer ? (
              <div className="mt-5 space-y-5">
                <SummaryBox><strong className="mr-2 text-white">Özet:</strong>{message.answer.summary}</SummaryBox>
                <div><h3 className="text-sm font-semibold text-white">Açıklama</h3><p className="mt-2 text-sm leading-7 text-neutral-300">{message.answer.explanation}</p></div>
                <div><h3 className="text-sm font-semibold text-white">Pratik adımlar</h3><div className="mt-3"><BulletList items={message.answer.practicalAdvice} /></div></div>
                <InfoCallout><span><strong className="font-semibold text-white">Kanıt notu:</strong> {message.answer.evidenceNote}</span></InfoCallout>
                {message.answer.sources && message.answer.sources.length > 0 && <ExpandableSection title={`Kaynaklar (${message.answer.sources.length})`}><div className="space-y-3">{message.answer.sources.map((source) => <SourceCard key={source.id} source={source} />)}</div></ExpandableSection>}
              </div>
            ) : <p className="mt-4 text-sm leading-7 text-neutral-300">{message.content}</p>}
          </AnswerCard>
        ) : (
          <>
            {isEditing ? <div className="space-y-3"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Mesajını düzenle" className="min-h-24 w-full rounded-xl border border-black/20 bg-white/30 p-3 text-black outline-none" /><button type="button" onClick={saveEdit} className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white">Kaydet</button></div> : <p>{message.content}</p>}
            {!isEditing && <div className="mt-3 flex justify-end"><ActionButton label="Mesajı düzenle" onClick={() => setIsEditing(true)} dark><Pencil className="size-3.5" /></ActionButton></div>}
          </>
        )}
      </div>
    </motion.article>
  );
}

function ActionButton({ children, label, onClick, dark = false }: { children: React.ReactNode; label: string; onClick: () => void; dark?: boolean }) {
  return <button type="button" onClick={onClick} aria-label={label} className={`inline-flex size-8 items-center justify-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A] ${dark ? "text-black/70 hover:bg-black/10" : "text-neutral-400 hover:bg-white/5 hover:text-[#C9A14A]"}`}>{children}</button>;
}
