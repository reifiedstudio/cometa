import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
  hint?: string;
  className?: string;
}

export function EmptyState({ icon, message, hint, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-[#717983]",
        className,
      )}
    >
      <div className="text-[#EBEEF1] mb-3">{icon}</div>
      <p className="text-sm">{message}</p>
      {hint && <p className="text-xs text-[#A0A5AE] mt-1">{hint}</p>}
    </div>
  );
}
