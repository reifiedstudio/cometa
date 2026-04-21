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
      <QueryProvider>{children}</QueryProvider>
    </AppClerkProvider>
  );
}
