import { statusBadgeColors, statusLabels } from "@/lib/document-labels";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, Clock, Loader2, PenLine, X } from "lucide-react";

const statusIcons: Record<string, React.ReactNode> = {
  approved: <Check size={10} />,
  reviewed: <Check size={10} />,
  rejected: <X size={10} />,
  pending: <Clock size={10} />,
  processing: <Loader2 size={10} className="animate-spin" />,
  awaiting_signature: <PenLine size={10} />,
  overdue: <AlertTriangle size={10} />,
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
        statusBadgeColors[status] ?? "bg-gray-100 text-gray-600",
        className,
      )}
    >
      {statusIcons[status]}
      {statusLabels[status] ?? status}
    </span>
  );
}
