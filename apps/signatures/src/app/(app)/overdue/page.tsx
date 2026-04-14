"use client";

import { Badge } from "@/components/ui/badge";
import { fetchOverdueSignatures } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Clock, Loader2 } from "lucide-react";
import Link from "next/link";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OverduePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["overdue-signatures"],
    queryFn: () => fetchOverdueSignatures(),
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <Clock size={20} className="text-muted-foreground" />
        <h1 className="text-lg font-semibold text-foreground">Overdue Requests</h1>
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
            Failed to load overdue requests.
          </div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Clock size={32} className="mb-3 opacity-40" />
            <p className="text-sm">No overdue requests</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <th className="px-6 py-3">Source Ref</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Signers</th>
                <th className="px-6 py-3">Expired</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((req: any) => {
                const daysOverdue = Math.ceil(
                  (Date.now() - new Date(req.expiresAt).getTime()) / (1000 * 60 * 60 * 24),
                );
                return (
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
                      <Badge className="border bg-red-50 text-red-600 border-red-200/60">
                        {daysOverdue} day{daysOverdue !== 1 ? "s" : ""} overdue
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {req.signersCount ?? req.signers?.length ?? 0}
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
