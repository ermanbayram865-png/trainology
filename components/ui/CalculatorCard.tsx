import type { ReactNode } from "react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export type CalculatorCardBadge =
  | "ENERGY LAB 2.0"
  | "ENERGY LAB İLE BAĞLANTILI"
  | "HIZLI HESAPLAMA"
  | "GELİŞMİŞ ANALİZ"
  | "YENİ";

type CalculatorCardProps = {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  category: ReactNode;
  badge: CalculatorCardBadge;
  href?: string;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
};

const badgeVariants: Record<CalculatorCardBadge, "gold" | "neutral"> = {
  "ENERGY LAB 2.0": "gold",
  "ENERGY LAB İLE BAĞLANTILI": "gold",
  "HIZLI HESAPLAMA": "neutral",
  "GELİŞMİŞ ANALİZ": "neutral",
  YENİ: "gold",
};

export default function CalculatorCard({
  title,
  description,
  icon,
  category,
  badge,
  href,
  onClick,
  className,
  compact = false,
}: CalculatorCardProps) {
  return (
    <Card
      title={title}
      description={
        compact ? <span className="line-clamp-2">{description}</span> : description
      }
      media={
        <div className={`relative flex items-end overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_25%_15%,rgba(201,161,74,.2),transparent_40%),linear-gradient(135deg,#121212,#070707)] ${compact ? "h-20 p-4" : "aspect-[16/9] p-5"}`}>
          <div className="absolute -right-8 -top-8 size-32 rounded-full border border-[#C9A14A]/15" />
          <div className="absolute -bottom-12 right-10 size-28 rounded-full border border-white/10" />
          <div className={`relative flex items-center justify-center rounded-2xl border border-[#C9A14A]/30 bg-[#C9A14A]/10 text-2xl text-[#C9A14A] shadow-[0_10px_28px_rgba(0,0,0,.3)] ${compact ? "size-11" : "size-14"}`}>
            {icon}
          </div>
        </div>
      }
      mediaClassName={compact ? "mb-4" : undefined}
      href={href}
      onClick={onClick}
      className={`h-full ${compact ? "!p-5 sm:!p-6" : ""} ${className ?? ""}`}
    >
      <div className={`flex flex-wrap items-center justify-between gap-3 border-t border-white/5 ${compact ? "pt-4" : "pt-5"}`}>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          {category}
        </span>
        <Badge variant={badgeVariants[badge]} className="max-w-full text-center">
          {badge}
        </Badge>
      </div>
    </Card>
  );
}
