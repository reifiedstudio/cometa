"use client"

import { cn } from "../lib/cn"

interface FullPageLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * Full-width, full-height layout that fills the viewport.
 * Use for standalone pages that don't use AppLayout (e.g. note viewer, public signing page).
 *
 * ```tsx
 * <FullPageLayout>
 *   <header>...</header>
 *   <main>...</main>
 * </FullPageLayout>
 * ```
 */
export function FullPageLayout({ children, className }: FullPageLayoutProps) {
  return (
    <div className={cn("flex flex-col w-full min-h-screen bg-background", className)}>
      {children}
    </div>
  )
}
