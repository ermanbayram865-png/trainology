import type { ReactNode } from "react";

import Card from "@/components/ui/Card";

export type FeatureGridItem = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  href?: string;
};

type FeatureGridProps = {
  items: FeatureGridItem[];
  columns?: 2 | 3 | 4;
  className?: string;
};

const columnClasses: Record<NonNullable<FeatureGridProps["columns"]>, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 xl:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

export default function FeatureGrid({
  items,
  columns = 3,
  className,
}: FeatureGridProps) {
  return (
    <div className={`grid gap-6 ${columnClasses[columns]} ${className ?? ""}`}>
      {items.map((item, index) => (
        <Card
          key={index}
          title={item.title}
          description={item.description}
          icon={item.icon}
          href={item.href}
          variant="subtle"
        />
      ))}
    </div>
  );
}
