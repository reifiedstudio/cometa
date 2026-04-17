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
  ChevronRight,
  Loader2,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { useState } from "react";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  partial: "bg-blue-50 text-blue-700 border-blue-200/60",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  expired: "bg-muted text-muted-foreground border-border",
};

const navItems = [
  { title: "Requests", url: "/", icon: PenLine, isActive: true },
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

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to requests
        </button>

        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading...
          </div>
        ) : error ? (
          <p className="text-muted-foreground">Failed to load signature request.</p>
        ) : (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold">
                  {data?.sourceRef || `Request ${requestId.slice(0, 8)}`}
                </h1>
                {data?.createdAt && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Created {formatDate(data.createdAt)}
                  </p>
                )}
              </div>
              {data?.status && (
                <Badge className={cn("border", statusStyles[data.status] ?? statusStyles.pending)}>
                  {data.status}
                </Badge>
              )}
            </div>

            {/* Document card */}
            <div className="rounded-lg border p-4 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-red-600">PDF</span>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {data?.sourceRef || `Request ${requestId.slice(0, 8)}`}
                  </p>
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

// ── Requests List ──

function RequestsListPage({
  onSelectRequest,
}: {
  onSelectRequest: (id: string) => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["signature-requests"],
    queryFn: () => listSignatureRequests(),
  });

  const requests = data ?? [];
  const awaiting = requests.filter(
    (r: any) => r.status === "pending" || r.status === "partial",
  ).length;
  const completed = requests.filter((r: any) => r.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Signature Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track and manage document signatures
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <p className="text-2xl font-semibold mt-1">{requests.length}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Awaiting Signatures</p>
          <p className="text-2xl font-semibold mt-1">{awaiting}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-semibold mt-1">{completed}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-5 animate-spin mr-2" />
          Loading...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Failed to load signature requests.
        </div>
      ) : !requests.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <PenLine className="size-8 mb-3 opacity-40" />
          <p className="text-sm">No signature requests yet</p>
        </div>
      ) : (
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
                  onClick={() => onSelectRequest(req.id)}
                >
                  <TableCell>
                    <span className="text-sm font-medium">
                      {req.sourceRef || req.id.slice(0, 8)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn("border", statusStyles[req.status] ?? statusStyles.pending)}
                    >
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
      )}
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
