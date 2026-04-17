"use client";

import QueryProvider from "@/components/query-provider";
import { setTokenGetter } from "@/lib/api";
import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
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
    <>
      <SignedIn>
        <AuthTokenSync />
        <QueryProvider>{children}</QueryProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
