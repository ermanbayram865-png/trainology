import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import Card from "@/components/ui/Card";

type CalculatorCardProps = {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
};

export default function CalculatorCard({
  title,
  description,
  icon,
  href,
  onClick,
  className,
  compact = false,
}: CalculatorCardProps) {
  if (compact) {
    return (
      <Card
        href={href}
        onClick={onClick}
        childrenClassName="!mt-0"
        className={`h-full !rounded-2xl !p-4 sm:!p-4 ${className ?? ""}`}
      >
        <div className="flex h-full min-h-20 items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#C9A14A]/30 bg-[#C9A14A]/10 text-[#C9A14A] shadow-[0_8px_20px_rgba(0,0,0,.25)] [&>svg]:size-5">
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-5 tracking-[-0.02em] text-white sm:text-lg">
              {title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-neutral-400">
              {description}
            </p>
          </div>

          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 text-neutral-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#C9A14A]"
          />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={title}
      description={description}
      media={
        <div className="relative flex aspect-[16/9] items-end overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_25%_15%,rgba(201,161,74,.2),transparent_40%),linear-gradient(135deg,#121212,#070707)] p-5">
          <div className="absolute -right-8 -top-8 size-28 rounded-full border border-[#C9A14A]/15" />
          <div className="absolute -bottom-12 right-10 size-24 rounded-full border border-white/10" />
          <div className="relative flex size-14 items-center justify-center rounded-xl border border-[#C9A14A]/30 bg-[#C9A14A]/10 text-xl text-[#C9A14A] shadow-[0_10px_28px_rgba(0,0,0,.3)]">
            {icon}
          </div>
        </div>
      }
      href={href}
      onClick={onClick}
      className={`h-full ${className ?? ""}`}
    />
  );
}
