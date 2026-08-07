"use client";

import { Menu, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import ChatComposer from "@/components/chat/ChatComposer";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import ProgramGenerator from "@/components/program/ProgramGenerator";
import Badge from "@/components/ui/Badge";
import { useChat } from "@/hooks/chat/useChat";
import { coachModes } from "@/lib/prompts";
import type { AICoachMode, UserProfile } from "@/types/chat";

const examplePrompts = [
  "Programımı nasıl daha verimli hale getirebilirim?",
  "Kreatin benim için uygun mu?",
  "Yağ kaybında protein neden önemli?",
];

export default function AICoachExperience() {
  const [mode, setMode] = useState<AICoachMode>("general");
  const [educationMode, setEducationMode] = useState(true);
  const [evidencePriority, setEvidencePriority] = useState<"standard" | "high">("high");
  const [profile, setProfile] = useState<UserProfile>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chat = useChat({
    mode,
    educationMode,
    evidencePriority,
    format: educationMode ? "structured" : "concise",
    context: "Trainology platformu için bilimsel fitness rehberliği.",
    userProfile: profile,
  });

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-14">
        <div className="max-w-3xl">
          <Badge variant="gold">AI COACH · BETA</Badge>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Bilimsel fitness rehberinle konuş.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-400 sm:text-lg">Trainology AI Coach; antrenman, beslenme ve supplement sorularını kanıt öncelikli, anlaşılır ve uygulanabilir bir çerçevede değerlendirir.</p>
          <div className="mt-6 flex flex-wrap gap-2">{examplePrompts.map((prompt) => <button key={prompt} type="button" onClick={() => void chat.sendMessage(prompt)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-[#C9A14A]/40 hover:text-[#C9A14A]">{prompt}</button>)}</div>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-[0_30px_80px_rgba(0,0,0,.3)]">
          <div className="grid min-h-[760px] lg:grid-cols-[17rem_minmax(0,1fr)]">
            <div className="hidden lg:block"><ChatSidebar conversations={chat.conversations} activeConversationId={chat.activeConversationId} search={chat.search} onSearch={chat.setSearch} onSelect={chat.setActiveConversationId} onNew={chat.createConversation} onRename={chat.renameConversation} onDelete={chat.deleteConversation} onPin={chat.togglePinned} /></div>
            <div className="flex min-h-0 flex-col p-4 sm:p-6">
              <CoachToolbar mode={mode} educationMode={educationMode} evidencePriority={evidencePriority} title={chat.activeConversation?.title ?? "Yeni konuşma"} onModeChange={setMode} onEducationChange={() => setEducationMode((value) => !value)} onEvidenceChange={() => setEvidencePriority((value) => value === "high" ? "standard" : "high")} onOpenSidebar={() => setIsSidebarOpen(true)} />
              <div className="mt-5 flex min-h-[450px] flex-1 flex-col"><ChatWindow messages={chat.messages} isStreaming={chat.isStreaming} error={chat.error} onEdit={chat.editMessage} onRegenerate={(id) => void chat.regenerateMessage(id)} onRetry={() => void chat.retryLastMessage()} /><ChatComposer onSend={chat.sendMessage} disabled={chat.isStreaming} /></div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,.75fr)]"><div className="rounded-3xl border border-white/10 bg-[#0B0B0B] p-6"><div className="flex items-center gap-2"><Sparkles className="size-4 text-[#C9A14A]" /><h2 className="text-lg font-semibold">Trainology yaklaşımı</h2></div><p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">Yanıtlar kanıt düzeyini, kişisel bağlamı ve belirsizlikleri görünür kılacak şekilde tasarlanır. AI Coach, tanı veya tedavi yerine geçmez.</p></div><ProgramGenerator onProfileChange={setProfile} /></div>
      </section>

      <AnimatePresence>{isSidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/70 lg:hidden"><motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: "spring", damping: 26, stiffness: 280 }} className="h-full w-[min(19rem,88vw)]"><ChatSidebar conversations={chat.conversations} activeConversationId={chat.activeConversationId} search={chat.search} onSearch={chat.setSearch} onSelect={(id) => { chat.setActiveConversationId(id); setIsSidebarOpen(false); }} onNew={() => { chat.createConversation(); setIsSidebarOpen(false); }} onRename={chat.renameConversation} onDelete={chat.deleteConversation} onPin={chat.togglePinned} onClose={() => setIsSidebarOpen(false)} /></motion.div></motion.div>}</AnimatePresence>
    </main>
  );
}

type CoachToolbarProps = {
  mode: AICoachMode;
  educationMode: boolean;
  evidencePriority: "standard" | "high";
  title: string;
  onModeChange: (mode: AICoachMode) => void;
  onEducationChange: () => void;
  onEvidenceChange: () => void;
  onOpenSidebar: () => void;
};

function CoachToolbar({ mode, educationMode, evidencePriority, title, onModeChange, onEducationChange, onEvidenceChange, onOpenSidebar }: CoachToolbarProps) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4"><div className="flex items-center gap-3"><button type="button" onClick={onOpenSidebar} aria-label="Konuşmaları aç" className="rounded-xl border border-white/10 p-2.5 text-neutral-300 hover:text-[#C9A14A] lg:hidden"><Menu className="size-4" /></button><div><p className="text-sm font-semibold text-white">{title}</p><p className="mt-1 text-xs text-neutral-500">Mock AI · API bağlanmaya hazır</p></div></div><div className="flex flex-wrap items-center gap-2"><label className="sr-only" htmlFor="coach-mode">Coach modu</label><select id="coach-mode" value={mode} onChange={(event) => onModeChange(event.target.value as AICoachMode)} className="rounded-lg border border-white/10 bg-[#111] px-2.5 py-2 text-xs text-neutral-300 outline-none focus:border-[#C9A14A]/60">{coachModes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><button type="button" onClick={onEducationChange} aria-pressed={educationMode} className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition ${educationMode ? "border-[#C9A14A]/40 bg-[#C9A14A]/10 text-[#C9A14A]" : "border-white/10 text-neutral-400"}`}>Eğitim modu</button><button type="button" onClick={onEvidenceChange} aria-pressed={evidencePriority === "high"} className="hidden rounded-lg border border-white/10 px-2.5 py-2 text-xs text-neutral-400 sm:block">Kanıt: {evidencePriority === "high" ? "Yüksek" : "Standart"}</button></div></div>;
}
