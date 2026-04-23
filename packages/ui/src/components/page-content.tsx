"use client"

import { cn } from "../lib/cn"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

/**
 * Consistent page header with title, optional description, and action slot.
 *
 * ```tsx
 * <PageHeader title="Documents" description="Manage your documents">
 *   <Button>Upload</Button>
 * </PageHeader>
 * ```
 */
export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between px-6 py-4 border-b shrink-0", className)}>
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

interface PageContentProps {
  children: React.ReactNode
  className?: string
  /** Remove default padding. Useful for full-bleed layouts like split views. */
  noPadding?: boolean
}

/**
 * Consistent page content area with standard padding.
 * Fills available space and scrolls internally.
 *
 * ```tsx
 * <PageContent>
 *   <Table>...</Table>
 * </PageContent>
 * ```
 */
export function PageContent({ children, className, noPadding }: PageContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto", !noPadding && "px-6 py-4", className)}>
      {children}
    </div>
  )
}
