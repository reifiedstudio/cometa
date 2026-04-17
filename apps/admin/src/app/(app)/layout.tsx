"use client";

import { AppClerkProvider } from "@/components/clerk-provider";
import QueryProvider from "@/components/query-provider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppClerkProvider>
      <QueryProvider>
        <div className="flex flex-1 flex-col min-h-0 w-full">{children}</div>
      </QueryProvider>
    </AppClerkProvider>
  );
}
