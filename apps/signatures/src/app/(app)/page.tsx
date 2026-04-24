"use client";

import SignatureStatus from "@/components/signature-status";
import { listSignatureRequests, getSignatureRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/clerk-react";
import { AppLayout } from "@cometa/ui/app-layout";
import { Badge } from "@cometa/ui/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cometa/ui/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  PenLine,
  CheckCircle2,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Eye,
} from "lucide-react";
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
  });
}

// ── Request Detail ──

function RequestDetailPage({
  requestId,
  onBack,
}: {
  requestId: string;
  onBack: () => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["signature-request", requestId],
    queryFn: () => getSignatureRequest(requestId),
  });

  const title = data?.sourceRef || `Request ${requestId.slice(0, 8)}`;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <div className="w-px h-4 bg-border" />
          <h1 className="text-sm font-semibold">{title}</h1>
          {data?.status && (
            <Badge className={cn("border text-[11px]", statusStyles[data.status] ?? statusStyles.pending)}>
              {data.status}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-20 justify-center">
            <Loader2 className="size-4 animate-spin" />
            Loading...
          </div>
        ) : error ? (
          <p className="text-muted-foreground text-center py-20">Failed to load signature request.</p>
        ) : (
          <>
            <div className="rounded-lg border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-red-600">PDF</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  {data?.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      Uploaded {formatDate(data.createdAt)}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium hover:bg-muted/50 transition-colors"
              >
                <Eye className="size-3.5" />
                View
              </button>
            </div>

            <SignatureStatus documentId={data?.sourceRef ?? requestId} />
          </>
        )}
      </div>
    </div>
  );
}

// ── Requests Table (shared) ──

export function RequestsTable({
  requests,
  onSelect,
}: {
  requests: any[];
  onSelect: (id: string) => void;
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
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Signers</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req: any) => (
            <TableRow
              key={req.id}
              className="cursor-pointer"
              onClick={() => onSelect(req.id)}
            >
              <TableCell>
                <span className="text-sm font-medium">
                  {req.sourceRef || `Request ${req.id.slice(0, 8)}`}
                </span>
              </TableCell>
              <TableCell>
                <Badge className={cn("border text-[11px]", statusStyles[req.status] ?? statusStyles.pending)}>
                  {req.status}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {req.signersCount ?? req.signers?.length ?? 0}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {formatDate(req.createdAt)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {req.expiresAt ? formatDate(req.expiresAt) : "—"}
                </span>
              </TableCell>
              <TableCell>
                <ChevronRight className="size-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Active Requests Page ──

function RequestsListPage({
  onSelectRequest,
}: {
  onSelectRequest: (id: string) => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["signature-requests"],
    queryFn: () => listSignatureRequests(),
  });

  const allRequests = Array.isArray(data) ? data : (data?.requests ?? []);
  const requests = allRequests.filter(
    (r: any) => r.status === "pending" || r.status === "partially_signed",
  );
  const awaitingCount = requests.length;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div>
          <h1 className="text-lg font-semibold">Requests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {awaitingCount} awaiting signature
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2" />
            Loading...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            Failed to load signature requests.
          </div>
        ) : (
          <RequestsTable requests={requests} onSelect={onSelectRequest} />
        )}
      </div>
    </div>
  );
}

// ── Main Page ──

export default function SignaturesPage() {
  const { signOut } = useClerk();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const breadcrumbs = selectedId
    ? [{ label: "Signatures" }, { label: "Requests", href: "/" }, { label: "Request" }]
    : [{ label: "Signatures" }, { label: "Requests" }];

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      navItems={navItems}
      onSignOut={() => signOut()}
    >
      {selectedId ? (
        <RequestDetailPage
          requestId={selectedId}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <RequestsListPage onSelectRequest={setSelectedId} />
      )}
    </AppLayout>
  );
}
