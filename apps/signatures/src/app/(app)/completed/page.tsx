"use client";

import { listSignatureRequests } from "@/lib/api";
import { useClerk } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { useQuery } from "@tanstack/react-query";
import { PenLine, CheckCircle2, Loader2 } from "lucide-react";
import { RequestsTable } from "../page";

const navItems = [
  { title: "Requests", url: "/", icon: PenLine },
  { title: "Completed", url: "/completed", icon: CheckCircle2, isActive: true },
];

export default function CompletedPage() {
  const { signOut } = useClerk();

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
      breadcrumbs={[{ label: "Signatures" }, { label: "Completed" }]}
      navItems={navItems}
      onSignOut={() => signOut()}
    >
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div>
            <h1 className="text-lg font-semibold">Completed</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {completed.length} signed and archived
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="size-5 animate-spin mr-2" />
              Loading...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Failed to load completed requests.
            </div>
          ) : (
            <RequestsTable requests={completed} onSelect={() => {}} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
