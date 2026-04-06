import { cn } from "@/lib/utils";
import { statusLabels, statusBadgeColors } from "@/lib/document-labels";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
        statusBadgeColors[status] ?? "bg-gray-100 text-gray-600",
        className,
      )}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
