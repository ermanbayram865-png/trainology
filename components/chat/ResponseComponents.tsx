import type { ReactNode } from "react";
import { AlertTriangle, ChevronDown, Info } from "lucide-react";

import Badge from "@/components/ui/Badge";
import type { EvidenceLevel } from "@/types/chat";

export function AnswerCard({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-white/10 bg-[#111] p-5 shadow-[0_16px_40px_rgba(0,0,0,.16)]">{children}</div>;
}

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  return <Badge variant={level === "Strong Evidence" ? "success" : "warning"}>{level}</Badge>;
}

export function InfoCallout({ children }: { children: ReactNode }) {
  return <div className="flex gap-3 rounded-xl border border-[#C9A14A]/20 bg-[#C9A14A]/5 p-4 text-sm leading-6 text-neutral-300"><Info className="mt-0.5 size-4 shrink-0 text-[#C9A14A]" />{children}</div>;
}

export function WarningCallout({ children }: { children: ReactNode }) {
  return <div className="flex gap-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-neutral-300"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />{children}</div>;
}

export function SummaryBox({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border-l-2 border-[#C9A14A] bg-white/[0.03] px-4 py-3 text-sm leading-6 text-neutral-200">{children}</div>;
}

export function BulletList({ items }: { items: readonly string[] }) {
  return <ul className="space-y-2 text-sm leading-6 text-neutral-300">{items.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#C9A14A]" />{item}</li>)}</ul>;
}

export function ExpandableSection({ title, children }: { title: string; children: ReactNode }) {
  return <details className="rounded-xl border border-white/10 bg-black/20 p-4"><summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-white">{title}<ChevronDown className="size-4 text-[#C9A14A]" /></summary><div className="mt-3 text-sm leading-6 text-neutral-400">{children}</div></details>;
}

export function ComparisonTable({ rows }: { rows: readonly { label: string; value: string }[] }) {
  return <div className="overflow-x-auto rounded-xl border border-white/10"><table className="w-full min-w-[22rem] text-left text-sm"><tbody>{rows.map((row) => <tr key={row.label} className="border-b border-white/5 last:border-0"><th className="bg-white/[0.02] px-4 py-3 font-medium text-white">{row.label}</th><td className="px-4 py-3 text-neutral-400">{row.value}</td></tr>)}</tbody></table></div>;
}
