import { cn } from "@/lib/utils";

interface SkeletonListProps {
  rows?: number;
  className?: string;
}

export function SkeletonList({ rows = 6, className }: SkeletonListProps) {
  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-3 border-b border-[#F0F0F0] last:border-b-0"
        >
          <div className="w-9 h-9 rounded-md bg-gradient-to-r from-[#EBEEF1] via-[#F8F8F8] to-[#EBEEF1] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-48 bg-[#EBEEF1] rounded animate-pulse" />
            <div className="h-3 w-24 bg-[#EBEEF1] rounded animate-pulse" />
          </div>
          <div className="h-3 w-16 bg-[#EBEEF1] rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
