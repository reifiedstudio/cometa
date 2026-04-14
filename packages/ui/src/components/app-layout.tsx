"use client"

import * as React from "react"
import { AppSidebar, type AppSidebarProps } from "./app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar"

interface BreadcrumbItem {
  label: string
  href?: string
}

export function AppLayout({
  breadcrumbs,
  children,
  services,
  navItems,
  user,
  onSignOut,
}: {
  breadcrumbs: BreadcrumbItem[]
  children: React.ReactNode
} & Pick<AppSidebarProps, "services" | "navItems" | "user" | "onSignOut">) {
  return (
    <SidebarProvider>
      <AppSidebar services={services} navItems={navItems} user={user} onSignOut={onSignOut} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, i) => {
                const isLast = i === breadcrumbs.length - 1
                return (
                  <React.Fragment key={item.label}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href ?? "#"}>
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
