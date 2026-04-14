"use client";

import { AppClerkProvider } from "@/components/clerk-provider";
import QueryProvider from "@/components/query-provider";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { ArrowLeftRight, FileSearch, FolderSync } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      title={label}
      className={cn(
        "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {icon}
    </Link>
  );
}

function Sidebar() {
  return (
    <aside className="flex flex-col items-center w-[60px] border-r bg-card py-4">
      {/* Logo */}
      <div className="mb-4">
        <FolderSync size={24} className="text-foreground" />
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        <SidebarLink href="/" icon={<ArrowLeftRight size={20} />} label="Handoffs" />
        <SidebarLink href="/lookup" icon={<FileSearch size={20} />} label="File Lookup" />
      </nav>

      {/* User */}
      <div className="mt-auto">
        <UserButton />
      </div>
    </aside>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppClerkProvider>
      <QueryProvider>
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
      </QueryProvider>
    </AppClerkProvider>
  );
}
