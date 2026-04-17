"use client";

import { AppClerkProvider } from "@/components/clerk-provider";
import QueryProvider from "@/components/query-provider";
import { setTokenGetter } from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

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
        <div className="flex flex-1 flex-col min-h-0 w-full">{children}</div>
      </QueryProvider>
    </AppClerkProvider>
  );
}
