"use client";

import DateRangePicker from "@/components/date-range-picker";
import DocumentList, { type DocumentListItem } from "@/components/document-list";
import SearchModal from "@/components/search-modal";
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import UploadModal from "@/components/upload-modal";
import { fetchDocuments } from "@/lib/api";
import { typePluralLabels } from "@/lib/document-labels";
import { useQuery } from "@tanstack/react-query";
import { PenLine, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignaturesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["signatures"],
    queryFn: () => fetchDocuments(),
    select: (data) => {
      const allDocs = (data.documents ?? data ?? []) as any[];
      const signatureDocs: DocumentListItem[] = allDocs
        .filter((d: any) => d.status === "awaiting_signature")
        .map((d: any) => ({
          id: d.id,
          description: d.description ?? d.originalName ?? d.id,
          type: d.type ?? "unknown",
          status: d.status,
          date: d.createdAt
            ? new Date(d.createdAt).toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          thumbnailUrl: d.thumbnailUrl,
          signatureProgress: d.signatureProgress ?? null,
        }));

      const counts: Record<string, number> = { all: signatureDocs.length };
      for (const d of signatureDocs) {
        counts[d.type] = (counts[d.type] ?? 0) + 1;
      }

      return { documents: signatureDocs, counts };
    },
    refetchInterval: 60_000,
  });

  const documents = data?.documents ?? [];
  const counts = data?.counts ?? { all: 0 };

  // Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredDocs =
    activeFilter === "all" ? documents : documents.filter((d) => d.type === activeFilter);

  const filterKeys = Object.keys(counts);
  const tabs = filterKeys.map((key) => ({
    key,
    label: typePluralLabels[key] ?? key,
    count: counts[key] ?? 0,
  }));

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <PageHeader title="Signatures">
        <SearchInput onClick={() => setIsSearchOpen(true)} />
        <Button onClick={() => setIsUploadOpen(true)}>
          <Upload size={16} />
          Upload
        </Button>
      </PageHeader>

      <div className="flex items-center justify-between px-8 py-3 border-b">
        <FilterTabs tabs={tabs} activeKey={activeFilter} onChange={(key) => setActiveFilter(key)} />
        <div className="flex items-center gap-2">
          <DateRangePicker
            onChange={(range) => {
              setDateFrom(range?.from?.toISOString());
              setDateTo(range?.to?.toISOString());
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-2">
        <DocumentList
          documents={filteredDocs}
          loading={isLoading}
          emptyMessage="No signature requests yet"
          onSelect={(doc) => router.push(`/documents/${doc.id}`)}
        />
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={() => refetch()}
      />
    </div>
  );
}
