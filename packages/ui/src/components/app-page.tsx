"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { SidebarTrigger } from "./ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbUIItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"

// ── Types ──

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AppPageProps {
  /** Breadcrumb trail shown above the title */
  breadcrumbs?: BreadcrumbItem[]
  /** Page title */
  title: string
  /** Description shown below the title */
  description?: string
  /** Action slot — rendered on the right side of the title row */
  actions?: React.ReactNode
  /** Page content */
  children: React.ReactNode
  /** Remove default padding from the content area */
  noPadding?: boolean
  className?: string
}

/**
 * Standard app page layout with breadcrumbs, title bar, and scrollable content.
 * Use inside `AppLayout` for consistent page structure across all apps.
 *
 * ```tsx
 * <AppLayout navItems={...} onSignOut={...}>
 *   <AppPage
 *     breadcrumbs={[{ label: "Notes" }, { label: "My Notes" }]}
 *     title="My Notes"
 *     actions={<ViewToggle />}
 *   >
 *     <CollectionView>...</CollectionView>
 *   </AppPage>
 * </AppLayout>
 * ```
 */
export function AppPage({
  breadcrumbs,
  title,
  description,
  actions,
  children,
  noPadding,
  className,
}: AppPageProps) {
  return (
    <div className={cn("flex flex-col flex-1 min-h-0", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="flex h-12 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, i) => {
                const isLast = i === breadcrumbs.length - 1
                return (
                  <React.Fragment key={item.label}>
                    <BreadcrumbUIItem>
                      {isLast ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href ?? "#"}>
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbUIItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      {/* Title bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Content */}
      <div className={cn("flex-1 min-h-0", noPadding ? "flex flex-col" : "overflow-y-auto px-6 py-4")}>
        {children}
      </div>
    </div>
  )
}
