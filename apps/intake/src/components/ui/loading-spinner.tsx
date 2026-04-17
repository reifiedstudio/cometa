import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center py-20", className)}>
      <Loader2 size={size} className="animate-spin text-[#717983]" />
    </div>
  );
}
