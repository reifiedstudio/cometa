"use client"

import * as React from "react"
import { AppSidebar, type AppSidebarProps } from "./app-sidebar"
import { SidebarInset, SidebarProvider } from "./ui/sidebar"

/**
 * Root layout wrapper — sidebar + content area.
 * Use `AppPage` inside for the breadcrumbs, title bar, and scrollable content.
 *
 * ```tsx
 * <AppLayout navItems={...} onSignOut={...}>
 *   <AppPage
 *     breadcrumbs={[{ label: "Notes" }, { label: "My Notes" }]}
 *     title="My Notes"
 *     actions={<ViewToggle />}
 *   >
 *     ...
 *   </AppPage>
 * </AppLayout>
 * ```
 */
export function AppLayout({
  children,
  services,
  navItems,
  user,
  onSignOut,
}: {
  children: React.ReactNode
} & Pick<AppSidebarProps, "services" | "navItems" | "user" | "onSignOut">) {
  return (
    <SidebarProvider>
      <AppSidebar services={services} navItems={navItems} user={user} onSignOut={onSignOut} />
      <SidebarInset className="flex flex-col h-svh overflow-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
