"use client";

import { useClerk, useUser } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { FileText, Home, Trash2 } from "lucide-react";

export type ActiveRoute = "home" | "documents" | "trash";

interface IntakeLayoutProps {
  active: ActiveRoute;
  children: React.ReactNode;
}

export function IntakeLayout({ active, children }: IntakeLayoutProps) {
  const { signOut } = useClerk();
  const { user } = useUser();

  const navItems = [
    { title: "Home", url: "/", icon: Home, isActive: active === "home" },
    { title: "Documents", url: "/documents", icon: FileText, isActive: active === "documents" },
    { title: "Trash", url: "/trash", icon: Trash2, isActive: active === "trash" },
  ];

  return (
    <AppLayout
      navItems={navItems}
      user={{
        name: user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "",
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        avatar: user?.imageUrl ?? "",
      }}
      onSignOut={() => signOut()}
    >
      {children}
    </AppLayout>
  );
}
