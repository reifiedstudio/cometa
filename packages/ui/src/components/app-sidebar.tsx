"use client"

import * as React from "react"
import {
  FileText,
  Globe,
  PenTool,
  Settings2,
  StickyNote,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"

const defaultServices = [
  { name: "Intake", logo: FileText, description: "Document intake & verification", url: "https://intake.daniellourie.me" },
  { name: "Tasks", logo: Users, description: "Task management", url: "https://tasks.daniellourie.me" },
  { name: "Sign", logo: PenTool, description: "E-signatures", url: "https://sign.daniellourie.me" },
  { name: "Notes", logo: StickyNote, description: "Internal wiki & reports", url: "https://notes.daniellourie.me" },
  { name: "Gateway", logo: Globe, description: "MCP gateway & API docs", url: "https://gateway.daniellourie.me" },
  { name: "Admin", logo: Settings2, description: "System administration", url: "https://admin.daniellourie.me" },
]

const defaultNavItems = [
  { title: "My Notes", url: "/?path=/story/pages-notes--my-notes-page", icon: StickyNote, isActive: true },
  { title: "Saved", url: "/?path=/story/pages-notes--saved", icon: Star },
]

const defaultUser = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  services?: { name: string; logo: React.ElementType; description: string; url?: string }[]
  navItems?: { title: string; url: string; icon?: LucideIcon; isActive?: boolean; onClick?: (e: React.MouseEvent) => void; items?: { title: string; url: string; onClick?: (e: React.MouseEvent) => void }[] }[]
  user?: { name: string; email: string; avatar: string }
  onSignOut?: () => void
}

export function AppSidebar({
  services = defaultServices,
  navItems = defaultNavItems,
  user = defaultUser,
  onSignOut,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={services} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onSignOut={onSignOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
