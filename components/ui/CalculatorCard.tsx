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
}: CalculatorCardProps) {
  return (
    <Card
      title={title}
      description={description}
      icon={icon}
      href={href}
      onClick={onClick}
      className={className}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-neutral-500">{category}</span>
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
