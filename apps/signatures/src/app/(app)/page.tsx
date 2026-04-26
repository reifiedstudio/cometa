"use client";

import { listSignatureRequests } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { CollectionProvider, CollectionView, CollectionItem, ViewToggle } from "@cometa/ui/collection-view";
import { Badge } from "@cometa/ui/ui/badge";
import { Button } from "@cometa/ui/ui/button";
import { useQuery } from "@tanstack/react-query";
import { NewRequestDialog } from "@/components/new-request-dialog";
import { PenLine, CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  partially_signed: "bg-blue-50 text-blue-700 border-blue-200/60",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  expired: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const navItems = [
  { title: "Requests", url: "/", icon: PenLine, isActive: true },
  { title: "Completed", url: "/completed", icon: CheckCircle2 },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RequestsCollection({
  requests,
}: {
  requests: any[];
}) {
  if (!requests.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <PenLine className="size-8 mb-3 opacity-40" />
        <p className="text-sm">No signature requests</p>
      </div>
    );
  }

  return (
    <CollectionView pageSize={9}>
      {requests.map((req: any) => (
        <CollectionItem
          key={req.id}
          title={req.sourceRef || `Request ${req.id.slice(0, 8)}`}
          timestamp={req.createdAt}
          href={`/request/${req.id}`}
          badge={
            <Badge className={cn("border text-[11px]", statusStyles[req.status] ?? statusStyles.pending)}>
              {req.status.replace("_", " ")}
            </Badge>
          }
          footer={
            <Badge variant="secondary" className="text-xs">
              {req.signedCount ?? 0}/{req.signersCount ?? 0} signed
            </Badge>
          }
          meta={req.expiresAt ? `Expires ${formatDate(req.expiresAt)}` : undefined}
        />
      ))}
    </CollectionView>
  );
}

export default function SignaturesPage() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [showNew, setShowNew] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["signature-requests"],
    queryFn: () => listSignatureRequests(),
  });

  const allRequests = Array.isArray(data) ? data : (data?.requests ?? []);
  const requests = allRequests.filter(
    (r: any) => r.status === "pending" || r.status === "partially_signed",
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
          breadcrumbs={[{ label: "Signatures" }, { label: "Requests" }]}
          title="Requests"
          description={`${requests.length} awaiting signature`}
          actions={
            <>
              <ViewToggle />
              <Button onClick={() => setShowNew(true)}>
                <Plus size={14} />
                New Request
              </Button>
            </>
          }
        >
          {isLoading ? null : error ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Failed to load signature requests.
            </div>
          ) : (
            <RequestsCollection requests={requests} />
          )}
        </AppPage>
      </CollectionProvider>

      <NewRequestDialog
        open={showNew}
        onOpenChange={setShowNew}
        onCreated={() => refetch()}
      />
    </AppLayout>
  );
}
