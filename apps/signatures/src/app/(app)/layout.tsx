"use client";

import { AppClerkProvider } from "@/components/clerk-provider";
import QueryProvider from "@/components/query-provider";
import { setTokenGetter } from "@/lib/api";
import { cn } from "@/lib/utils";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { Clock, PenLine } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="32" height="32">
          <defs>
            <clipPath id="lc">
              <rect width="200" height="200" x="0" y="0" />
            </clipPath>
            <g id="lg">
              <g transform="matrix(0.997,0,0,1,100.147,100)" opacity="1">
                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                  <path
                    fill="rgb(255,0,0)"
                    fillOpacity="1"
                    d="M51.995,-68.599 C51.995,-31.97 22.612,-2.586 -14.017,-2.586 C-14.017,-2.586 -51.854,-2.586 -51.854,-2.586 C-53.188,-2.586 -54.269,-1.505 -54.269,-0.171 C-54.269,1.163 -53.188,2.244 -51.854,2.244 C-51.854,2.244 -14.017,2.244 -14.017,2.244 C22.612,2.244 51.995,31.628 51.995,68.257 C51.995,68.257 52.995,68.257 52.995,68.257 C52.995,68.257 52.995,-68.599 52.995,-68.599 C52.995,-68.599 51.995,-68.599 51.995,-68.599z"
                  />
                </g>
              </g>
            </g>
            <filter
              id="lf"
              filterUnits="objectBoundingBox"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
            >
              <feComponentTransfer in="SourceGraphic">
                <feFuncA type="table" tableValues="1.0 0.0" />
              </feComponentTransfer>
            </filter>
            {/* @ts-expect-error maskType is a valid SVG attribute */}
            <mask id="lm" maskType="alpha">
              <g filter="url(#lf)">
                <rect width="200" height="200" x="0" y="0" fill="#ffffff" opacity="0" />
                <use xlinkHref="#lg" />
              </g>
            </mask>
          </defs>
          <g clipPath="url(#lc)">
            <g mask="url(#lm)">
              <g transform="matrix(1,0,0,1,100,100)" opacity="1">
                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                  <path
                    fill="rgb(0,0,0)"
                    fillOpacity="1"
                    d="M-51.925,-68.428 L51.925,-68.428 L51.925,68.428 L-51.925,68.428z"
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        <SidebarLink href="/" icon={<PenLine size={20} />} label="Requests" />
        <SidebarLink href="/overdue" icon={<Clock size={20} />} label="Overdue" />
      </nav>

      {/* User */}
      <div className="mt-auto">
        <UserButton />
      </div>
    </aside>
  );
}

function AuthTokenSync() {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  return null;
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppClerkProvider>
      <AuthTokenSync />
      <QueryProvider>
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
      </QueryProvider>
    </AppClerkProvider>
  );
}
