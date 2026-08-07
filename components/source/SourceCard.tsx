"use client";

import { ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";

import Badge from "@/components/ui/Badge";
import type { SourceReference } from "@/types/chat";

type SourceCardProps = {
  source: SourceReference;
};

export default function SourceCard({ source }: SourceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A]"
      >
        <div>
          <p className="text-sm font-semibold leading-6 text-white">{source.title}</p>
          <p className="mt-1 text-xs leading-5 text-neutral-500">{source.journal} · {source.year}</p>
        </div>
        <ChevronDown className={`mt-1 size-4 shrink-0 text-[#C9A14A] transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="mt-4 border-t border-white/5 pt-4 text-xs leading-5 text-neutral-400">
          <p>{source.authors}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={source.evidenceLevel === "Strong Evidence" ? "success" : "warning"}>
              {source.evidenceLevel}
            </Badge>
            {source.doi && <span>DOI: {source.doi}</span>}
            {source.pmid && <span>PMID: {source.pmid}</span>}
            {source.doi && (
              <a
                href={`https://doi.org/${source.doi}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`${source.title} kaynağını aç`}
                className="inline-flex items-center gap-1 text-[#C9A14A] hover:underline"
              >
                Kaynağı aç <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
