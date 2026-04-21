"use client";

import { ClerkProvider, SignIn, useAuth, useOrganizationList, useUser } from "@clerk/clerk-react";
import { PageLoader } from "@cometa/ui/page-loader";
import { useEffect, useState } from "react";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

function OrgAutoSelector({ children }: { children: React.ReactNode }) {
  const { orgId } = useAuth();
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  useEffect(() => {
    if (!orgId && userMemberships?.data?.length && setActive) {
      setActive({ organization: userMemberships.data[0].organization.id });
    }
  }, [orgId, userMemberships?.data, setActive]);

  return <>{children}</>;
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const [minWait, setMinWait] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinWait(false), 1300);
    return () => clearTimeout(timer);
  }, []);

  const loading = !isLoaded || minWait;

  if (loading) {
    return <PageLoader />;
  }

  if (!isSignedIn) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <SignIn routing="hash" />
      </div>
    );
  }

  return <OrgAutoSelector>{children}</OrgAutoSelector>;
}

export function AppClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthGate>{children}</AuthGate>
    </ClerkProvider>
  );
}
