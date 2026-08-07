"use client";

import { Edit3, MessageSquarePlus, Pin, Search, Trash2, X } from "lucide-react";
import { useState } from "react";

import type { Conversation } from "@/types/chat";

type ChatSidebarProps = {
  conversations: readonly Conversation[];
  activeConversationId: string;
  search: string;
  onSearch: (value: string) => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  onClose?: () => void;
};

export default function ChatSidebar(props: ChatSidebarProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const pinned = props.conversations.filter((conversation) => conversation.pinned);
  const unpinned = props.conversations.filter((conversation) => !conversation.pinned);
  const groups = {
    today: unpinned.filter((conversation) => getConversationAge(conversation.updatedAt) === "today"),
    yesterday: unpinned.filter((conversation) => getConversationAge(conversation.updatedAt) === "yesterday"),
    lastWeek: unpinned.filter((conversation) => getConversationAge(conversation.updatedAt) === "lastWeek"),
    older: unpinned.filter((conversation) => getConversationAge(conversation.updatedAt) === "older"),
  };

  function beginRename(conversation: Conversation) {
    setRenamingId(conversation.id);
    setRenameValue(conversation.title);
  }

  function saveRename() {
    if (renamingId) props.onRename(renamingId, renameValue);
    setRenamingId(null);
  }

  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-[#080808] p-4 lg:max-w-72">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-wide text-white">Konuşmalar</p>
        {props.onClose && <button type="button" onClick={props.onClose} aria-label="Konuşma panelini kapat" className="rounded-lg p-2 text-neutral-400 hover:text-white lg:hidden"><X className="size-5" /></button>}
      </div>
      <button type="button" onClick={props.onNew} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9A14A]/30 bg-[#C9A14A]/10 px-4 py-3 text-sm font-semibold text-[#C9A14A] transition hover:bg-[#C9A14A]/15"><MessageSquarePlus className="size-4" />Yeni sohbet</button>
      <label className="relative mt-4 block"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" /><input value={props.search} onChange={(event) => props.onSearch(event.target.value)} placeholder="Konuşmalarda ara" aria-label="Konuşmalarda ara" className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-[#C9A14A]/60" /></label>
      <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
        <ConversationGroup title="Sabitlenenler" conversations={pinned} activeId={props.activeConversationId} renamingId={renamingId} renameValue={renameValue} setRenameValue={setRenameValue} onSelect={props.onSelect} onPin={props.onPin} onDelete={props.onDelete} onBeginRename={beginRename} onSaveRename={saveRename} />
        <ConversationGroup title="Bugün" conversations={groups.today} activeId={props.activeConversationId} renamingId={renamingId} renameValue={renameValue} setRenameValue={setRenameValue} onSelect={props.onSelect} onPin={props.onPin} onDelete={props.onDelete} onBeginRename={beginRename} onSaveRename={saveRename} />
        <ConversationGroup title="Dün" conversations={groups.yesterday} activeId={props.activeConversationId} renamingId={renamingId} renameValue={renameValue} setRenameValue={setRenameValue} onSelect={props.onSelect} onPin={props.onPin} onDelete={props.onDelete} onBeginRename={beginRename} onSaveRename={saveRename} />
        <ConversationGroup title="Son 7 Gün" conversations={groups.lastWeek} activeId={props.activeConversationId} renamingId={renamingId} renameValue={renameValue} setRenameValue={setRenameValue} onSelect={props.onSelect} onPin={props.onPin} onDelete={props.onDelete} onBeginRename={beginRename} onSaveRename={saveRename} />
        <ConversationGroup title="Daha Eski" conversations={groups.older} activeId={props.activeConversationId} renamingId={renamingId} renameValue={renameValue} setRenameValue={setRenameValue} onSelect={props.onSelect} onPin={props.onPin} onDelete={props.onDelete} onBeginRename={beginRename} onSaveRename={saveRename} />
      </div>
      <p className="mt-4 border-t border-white/5 pt-4 text-xs leading-5 text-neutral-600">Konuşmalar bu demo sürümünde yerel mock state ile tutulur.</p>
    </aside>
  );
}

type GroupProps = {
  title: string;
  conversations: readonly Conversation[];
  activeId: string;
  renamingId: string | null;
  renameValue: string;
  setRenameValue: (value: string) => void;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onBeginRename: (conversation: Conversation) => void;
  onSaveRename: () => void;
};

function ConversationGroup({ title, conversations, activeId, renamingId, renameValue, setRenameValue, onSelect, onPin, onDelete, onBeginRename, onSaveRename }: GroupProps) {
  if (conversations.length === 0) return null;
  return <section className="mb-6"><h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-600">{title}</h2><div className="space-y-1">{conversations.map((conversation) => <div key={conversation.id} className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 ${conversation.id === activeId ? "bg-white/[0.07] text-white" : "text-neutral-400 hover:bg-white/[0.04]"}`}><button type="button" onClick={() => onSelect(conversation.id)} className="min-w-0 flex-1 truncate text-left text-sm">{renamingId === conversation.id ? <input autoFocus value={renameValue} onChange={(event) => setRenameValue(event.target.value)} onBlur={onSaveRename} onKeyDown={(event) => { if (event.key === "Enter") onSaveRename(); }} onClick={(event) => event.stopPropagation()} aria-label="Konuşma adı" className="w-full bg-transparent outline-none" /> : conversation.title}</button><div className="flex shrink-0 items-center gap-0.5"><IconButton label="Sabitle" onClick={() => onPin(conversation.id)}><Pin className="size-3.5" /></IconButton><IconButton label="Yeniden adlandır" onClick={() => onBeginRename(conversation)}><Edit3 className="size-3.5" /></IconButton><IconButton label="Sil" onClick={() => onDelete(conversation.id)}><Trash2 className="size-3.5" /></IconButton></div></div>)}</div></section>;
}

function getConversationAge(updatedAt: string): "today" | "yesterday" | "lastWeek" | "older" {
  const days = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days <= 7) return "lastWeek";
  return "older";
}

function IconButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-label={label} className="rounded p-1 text-neutral-500 hover:text-[#C9A14A]">{children}</button>;
}
