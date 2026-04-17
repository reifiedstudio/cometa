import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
  hint?: string;
  className?: string;
}

export function EmptyState({ icon, message, hint, className }: EmptyStateProps) {
  return (
    <div className="flex justify-center p-3">
      <div
        className={cn(
          "inline-flex flex-col items-center justify-center gap-2 px-5 py-4 text-muted-foreground",
          className,
        )}
      >
        <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground/60 [&_svg]:size-4 [&_svg]:stroke-[1.75]">
          {icon}
        </div>
        <p className="text-xs font-medium">{message}</p>
        {hint && <p className="text-[11px] text-muted-foreground/60">{hint}</p>}
      </div>
    </div>
  );
}
