"use client";

import { Badge } from "@/components/ui/badge";
import { listSignatureRequests } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2, PenLine } from "lucide-react";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  partial: "bg-blue-50 text-blue-700 border-blue-200/60",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  expired: "bg-muted text-muted-foreground border-border",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RequestsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["signature-requests"],
    queryFn: () => listSignatureRequests(),
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <PenLine size={20} className="text-muted-foreground" />
          <h1 className="text-lg font-semibold text-foreground">Signature Requests</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 size={20} className="animate-spin mr-2" />
            Loading...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            Failed to load signature requests.
          </div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <PenLine size={32} className="mb-3 opacity-40" />
            <p className="text-sm">No signature requests yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <th className="px-6 py-3">Source Ref</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Signers</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Expires</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((req: any) => (
                <tr key={req.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-3">
                    <Link
                      href={`/requests/${req.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {req.sourceRef || req.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-3">
                    <Badge
                      className={cn("border", statusStyles[req.status] ?? statusStyles.pending)}
                    >
                      {req.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {req.signersCount ?? req.signers?.length ?? 0}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground tabular-nums">
                    {formatDate(req.createdAt)}
                  </td>
                  <td className="px-6 py-3 text-muted-foreground tabular-nums">
                    {req.expiresAt ? formatDate(req.expiresAt) : "-"}
                  </td>
                  <td className="px-6 py-3">
                    <Link href={`/requests/${req.id}`}>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
