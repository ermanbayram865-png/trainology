"use client";

import { useEffect, useRef } from "react";

import ChatMessage from "@/components/chat/ChatMessage";
import TypingIndicator, { ChatLoadingSkeleton } from "@/components/chat/TypingIndicator";
import type { ChatMessage as ChatMessageData } from "@/types/chat";

type ChatWindowProps = {
  messages: readonly ChatMessageData[];
  isStreaming: boolean;
  error: string | null;
  onEdit: (messageId: string, content: string) => void;
  onRegenerate: (messageId: string) => void;
  onRetry: () => void;
};

export default function ChatWindow({ messages, isStreaming, error, onEdit, onRegenerate, onRetry }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return <div className="flex min-h-72 items-center justify-center rounded-3xl border border-dashed border-white/10 px-6 text-center"><div><p className="text-lg font-semibold text-white">Yeni bir bilimsel soru sor.</p><p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">Hedefin, mevcut rutinin veya merak ettiğin kavramla başlayabilirsin.</p></div></div>;
  }

  return (
    <section aria-label="AI Coach konuşması" className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
      {messages.map((message) => <ChatMessage key={message.id} message={message} onEdit={onEdit} onRegenerate={onRegenerate} />)}
      {isStreaming && <><TypingIndicator /><ChatLoadingSkeleton /></>}
      {error && <div role="alert" className="flex items-center justify-between gap-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100"><span>{error}</span><button type="button" onClick={onRetry} className="shrink-0 font-semibold text-amber-200 hover:underline">Tekrar dene</button></div>}
      <div ref={endRef} />
    </section>
  );
}
