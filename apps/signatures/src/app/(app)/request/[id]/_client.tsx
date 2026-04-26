"use client";

import SignatureStatus from "@/components/signature-status";
import { getSignatureRequest, getRequestDocument } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { AppPage } from "@cometa/ui/app-page";
import { DetailPanel } from "@cometa/ui/detail-panel";
import { Badge } from "@cometa/ui/ui/badge";
import { Button } from "@cometa/ui/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  PenLine,
  CheckCircle2,
  Loader2,
  Eye,
  PanelRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  partially_signed: "bg-blue-50 text-blue-700 border-blue-200/60",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  expired: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const navItems = [
  { title: "Requests", url: "/", icon: PenLine },
  { title: "Completed", url: "/completed", icon: CheckCircle2 },
];

export default function RequestDetailClient() {
  const pathname = usePathname();
  const requestId = pathname?.split("/request/")[1]?.replace(/\/$/, "") ?? "";
  const { signOut } = useClerk();
  const { user } = useUser();
  const [panelOpen, setPanelOpen] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ["signature-request", requestId],
    queryFn: () => getSignatureRequest(requestId),
    enabled: !!requestId && requestId !== "_",
  });

  const hasFile = data?.files?.length > 0;
  const { data: docData } = useQuery({
    queryKey: ["signature-document", requestId],
    queryFn: () => getRequestDocument(requestId),
    enabled: !!data && hasFile,
    refetchInterval: 10 * 60_000,
    retry: false,
  });

  const fileName = data?.files?.[0]?.originalName ?? data?.sourceRef ?? `Request ${requestId.slice(0, 8)}`;

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
      <AppPage
        breadcrumbs={[{ label: "Signatures" }, { label: "Requests", href: "/" }, { label: fileName }]}
        title={fileName}
        actions={
          <>
            {data?.status && (
              <Badge className={cn("border text-[11px]", statusStyles[data.status] ?? statusStyles.pending)}>
                {data.status.replace("_", " ")}
              </Badge>
            )}
            <Button
              variant={panelOpen ? "secondary" : "ghost"}
              size="icon"
              className="size-8"
              onClick={() => setPanelOpen(!panelOpen)}
            >
              <PanelRight className="size-4" />
            </Button>
          </>
        }
        noPadding
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-20 justify-center">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-muted-foreground text-center py-20">Failed to load signature request.</p>
        ) : (
          <div className="flex flex-1 min-h-0">
            <div className={cn("flex-1 min-w-0 bg-muted/30", panelOpen && "border-r")}>
              {docData?.url ? (
                <iframe
                  src={docData.url}
                  className="w-full h-full"
                  title={fileName}
                />
              ) : hasFile ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Loading document...
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                  <Eye className="size-8 opacity-30" />
                  <p className="text-sm">No document attached</p>
                </div>
              )}
            </div>

            <DetailPanel
              open={panelOpen}
              onOpenChange={setPanelOpen}
            >
              <div className="p-4">
                <SignatureStatus documentId={requestId} />
              </div>
            </DetailPanel>
          </div>
        )}
      </AppPage>
    </AppLayout>
  );
}
