"use client";

import SignatureStatus from "@/components/signature-status";
import { Button } from "@/components/ui/button";
import { getSignatureRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["signature-request", id],
    queryFn: () => getSignatureRequest(id),
    enabled: id !== "_",
  });

  if (id === "_") return null;

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <Link href="/">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {isLoading ? "Loading..." : data?.sourceRef || `Request ${id.slice(0, 8)}`}
          </h1>
          {data?.createdAt && (
            <p className="text-xs text-muted-foreground">
              Created{" "}
              {new Date(data.createdAt).toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 max-w-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 size={20} className="animate-spin mr-2" />
            Loading...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            Failed to load signature request.
          </div>
        ) : (
          <SignatureStatus documentId={data?.sourceRef ?? id} />
        )}
      </div>
    </div>
  );
}
