"use client"

import * as React from "react"
import {
  FileText,
  HardDrive,
  PenTool,
  Settings2,
  Users,
  StickyNote,
  Star,
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
  { name: "Documents", logo: FileText, description: "Document management" },
  { name: "Drive", logo: HardDrive, description: "File storage" },
  { name: "Tasks", logo: Users, description: "Task management" },
  { name: "Sign", logo: PenTool, description: "E-signatures" },
  { name: "Admin", logo: Settings2, description: "System administration" },
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
  services?: { name: string; logo: React.ElementType; description: string }[]
  navItems?: { title: string; url: string; icon?: LucideIcon; isActive?: boolean; items?: { title: string; url: string }[] }[]
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
