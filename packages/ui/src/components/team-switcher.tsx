"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import { LogoIcon } from "./logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    description: string
    url?: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeService, setActiveService] = React.useState(() => {
    if (typeof window === "undefined") return teams[0]
    const origin = window.location.origin
    return teams.find((t) => t.url && origin === new URL(t.url).origin) ?? teams[0]
  })

  if (!activeService) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center">
              <LogoIcon className="h-6 w-auto" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Cometa</span>
              <span className="truncate text-xs text-muted-foreground">{activeService.name}</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Services
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            {teams.map((service) => (
              <DropdownMenuItem
                key={service.name}
                onClick={() => {
                  setActiveService(service)
                  if (service.url) {
                    window.location.href = service.url
                  }
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <service.logo className="size-3.5 shrink-0" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-medium">{service.name}</span>
                  <span className="text-xs text-muted-foreground">{service.description}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
