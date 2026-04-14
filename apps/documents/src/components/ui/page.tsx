"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Standard page layout primitives.
 *
 * Compose like:
 *
 *   <Page>
 *     <Page.Header title="Documents" icon={<FileText />}>
 *       <Button>Upload</Button>
 *     </Page.Header>
 *     <Page.Subbar>{filters}</Page.Subbar>
 *     <Page.Body width="full">{list}</Page.Body>
 *   </Page>
 *
 * Width variants:
 *   - "full"     → full-width with px-8 py-2     (lists, dashboards)
 *   - "centered" → max-w-2xl mx-auto px-8 py-8   (forms, detail editors)
 *   - "wide"     → max-w-3xl mx-auto px-8 py-8   (settings hubs)
 */

export function Page({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col min-h-0">{children}</div>;
}

// ── Header (top bar, h-14) ──

interface HeaderProps {
  title?: string;
  icon?: React.ReactNode;
  backHref?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

function Header({ title, icon, backHref, breadcrumbs, children }: HeaderProps) {
  const router = useRouter();
  const hasBack = !!backHref;

  return (
    <div className="h-16 min-h-16 max-h-16 flex items-center justify-between px-6 border-b bg-card flex-shrink-0 box-border">
      <div className="flex items-center gap-3 min-w-0">
        {hasBack && (
          <>
            <Button variant="ghost" size="sm" onClick={() => router.push(backHref!)}>
              <ArrowLeft size={16} />
              Back
            </Button>
            <div className="w-px h-5 bg-border" />
          </>
        )}
        {icon && !breadcrumbs && <span className="text-muted-foreground">{icon}</span>}

        {breadcrumbs ? (
          <div className="flex items-center gap-2 min-w-0">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <div key={i} className="flex items-center gap-2 min-w-0">
                  {i > 0 && (
                    <ChevronRight size={14} className="text-muted-foreground/30 flex-shrink-0" />
                  )}
                  {crumb.href && !isLast ? (
                    <button
                      type="button"
                      onClick={() => router.push(crumb.href!)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span
                      className={cn(
                        "text-sm truncate",
                        isLast ? "font-semibold text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {crumb.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          title && <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>
        )}
      </div>
      {children && <div className="flex items-center gap-2 flex-shrink-0">{children}</div>}
    </div>
  );
}

// ── Subbar (filters / metadata row, h-12) ──

function Subbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "h-12 min-h-12 max-h-12 flex items-center justify-between px-8 border-b bg-card flex-shrink-0 box-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Body (scrollable content) ──

interface BodyProps {
  children: React.ReactNode;
  width?: "full" | "centered" | "wide";
  className?: string;
}

function Body({ children, width = "full", className }: BodyProps) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div
        className={cn(
          width === "full" && "px-8 py-2",
          width === "centered" && "max-w-2xl mx-auto px-8 py-8",
          width === "wide" && "max-w-3xl mx-auto px-8 py-8",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

// ── Footer (sticky bottom action bar, h-14) ──

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-16 min-h-16 max-h-16 flex items-center justify-between px-6 border-t bg-card flex-shrink-0 box-border">
      {children}
    </div>
  );
}

Page.Header = Header;
Page.Subbar = Subbar;
Page.Body = Body;
Page.Footer = Footer;
