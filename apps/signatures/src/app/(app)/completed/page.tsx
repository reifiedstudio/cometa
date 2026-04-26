"use client";

import { listSignatureRequests } from "@/lib/api";
import { useClerk, useUser } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { CollectionProvider, ViewToggle } from "@cometa/ui/collection-view";
import { useQuery } from "@tanstack/react-query";
import { PenLine, CheckCircle2 } from "lucide-react";
import { RequestsCollection } from "../page";

const navItems = [
  { title: "Requests", url: "/", icon: PenLine },
  { title: "Completed", url: "/completed", icon: CheckCircle2, isActive: true },
];

export default function CompletedPage() {
  const { signOut } = useClerk();
  const { user } = useUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ["signature-requests"],
    queryFn: () => listSignatureRequests(),
  });

  const allRequests = Array.isArray(data) ? data : (data?.requests ?? []);
  const completed = allRequests.filter(
    (r: any) => r.status === "completed" || r.status === "expired" || r.status === "cancelled",
  );

  return (
    <AppLayout
      navItems={navItems}
      user={{
        name: user?.fullName || "User",
        email: user?.primaryEmailAddress?.emailAddress || "",
        avatar: user?.imageUrl || "",
      }}
      onSignOut={() => signOut()}
    >
      <CollectionProvider>
        <AppPage
          breadcrumbs={[{ label: "Signatures" }, { label: "Completed" }]}
          title="Completed"
          description={`${completed.length} signed and archived`}
          actions={<ViewToggle />}
        >
          {isLoading ? null : error ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Failed to load completed requests.
            </div>
          ) : (
            <RequestsCollection requests={completed} />
          )}
        </AppPage>
      </CollectionProvider>
    </AppLayout>
  );
}
