"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  backHref?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, icon, backHref, children, className }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "h-16 min-h-16 max-h-16 flex items-center justify-between px-6 border-b bg-card flex-shrink-0 box-border",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {backHref && (
          <>
            <Button variant="ghost" size="sm" onClick={() => router.push(backHref)}>
              <ArrowLeft size={16} />
              Back
            </Button>
            <div className="w-px h-5 bg-border" />
          </>
        )}
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
