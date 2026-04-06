import { cn } from "@/lib/utils";
import { typeLabels, typeBadgeColors } from "@/lib/document-labels";

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
        typeBadgeColors[type] ?? "bg-gray-100 text-gray-600",
        className,
      )}
    >
      {typeLabels[type] ?? type}
    </span>
  );
}
