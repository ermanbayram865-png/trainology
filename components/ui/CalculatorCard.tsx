import type { ReactNode } from "react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export type CalculatorCardStatus = "active" | "comingSoon" | "new";

type CalculatorCardProps = {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  category: ReactNode;
  status: CalculatorCardStatus;
  href?: string;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
};

const statusLabels: Record<CalculatorCardStatus, string> = {
  active: "ACTIVE",
  comingSoon: "COMING SOON",
  new: "NEW",
};

export default function CalculatorCard({
  title,
  description,
  icon,
  category,
  status,
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
      <div className={`flex items-center justify-between gap-4 border-t border-white/5 ${compact ? "pt-4" : "pt-5"}`}>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          {category}
        </span>
        <Badge
          variant={
            status === "active"
              ? "success"
              : status === "new"
                ? "gold"
                : "neutral"
          }
        >
          {statusLabels[status]}
        </Badge>
      </div>
    </Card>
  );
}
