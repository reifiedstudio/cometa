import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, icon, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4 border-b border-[#EBEEF1]",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-[#717983]">{icon}</span>}
        <h1 className="text-lg font-semibold text-[#212327]">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
