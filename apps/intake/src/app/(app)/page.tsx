"use client";

import DocumentList, { type DocumentListItem } from "@/components/document-list";
import { IntakeLayout } from "@/components/intake-layout";
import { fetchDocuments } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function toDocumentListItem(doc: any): DocumentListItem {
  return {
    id: doc.id,
    description: doc.description ?? doc.originalName ?? null,
    originalName: doc.originalName,
    type: doc.type ?? "unknown",
    status: doc.status,
    date: formatDate(doc.receivedAt ?? doc.createdAt),
    thumbnailUrl: doc.thumbnailUrl,
    signatureProgress: doc.signatureProgress ?? null,
  };
}

export default function HomePage() {
  const router = useRouter();

  const { data, isLoading: loading } = useQuery({
    queryKey: ["dashboard-recent"],
    queryFn: async () => {
      const allData = await fetchDocuments();
      const docs = allData.documents ?? [];
      return docs.slice(0, 10).map(toDocumentListItem);
    },
    refetchInterval: 60_000,
  });

  const recentDocs = data ?? [];

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <IntakeLayout breadcrumbs={[{ label: "Intake" }, { label: "Home" }]} active="home">
      <div className="flex flex-col flex-1 min-h-0 gap-4">
        <h1 className="text-lg font-semibold">{greeting}</h1>

        <div className="rounded-lg border flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-sm font-semibold">Recent documents</h3>
            <button
              type="button"
              onClick={() => router.push("/documents")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </button>
          </div>
          <div className="px-1 py-1 overflow-y-auto flex-1">
            <DocumentList
              documents={recentDocs}
              loading={loading}
              emptyMessage="No documents yet"
              groupByMonth={false}
              onSelect={(doc) => router.push(`/documents/${doc.id}`)}
            />
          </div>
        </div>
      </div>
    </IntakeLayout>
  );
}
