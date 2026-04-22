"use client";

import DateRangePicker from "@/components/date-range-picker";
import DocumentList from "@/components/document-list";
import SearchModal from "@/components/search-modal";
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import UploadModal from "@/components/upload-modal";
import { fetchDocuments } from "@/lib/api";
import { typePluralLabels } from "@/lib/document-labels";
import type { Document } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { FileText, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function mapApiDocToUi(apiDoc: any): Document {
  const flags: Document["flags"] = Array.isArray(apiDoc.flags) ? apiDoc.flags : [];
  if (apiDoc.isVerified && !flags.some((f) => f.message === "Verified")) {
    flags.push({ type: "success", message: "Verified" });
  }
  if (apiDoc.isDuplicate && !flags.some((f) => f.message === "Duplicate")) {
    flags.push({ type: "warning", message: "Duplicate" });
  }

  return {
    id: apiDoc.id,
    type: apiDoc.type ?? "invoice",
    status: apiDoc.status ?? "pending",
    flags,
    description: apiDoc.description ?? apiDoc.originalName ?? "Untitled document",
    date: apiDoc.receivedAt
      ? new Date(apiDoc.receivedAt).toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    approved: apiDoc.status === "reviewed" || apiDoc.isVerified === true,
    thumbnailUrl: apiDoc.thumbnailUrl ?? undefined,
    previewUrl: apiDoc.previewUrl ?? null,
    extractedData: apiDoc.extractedData ?? undefined,
    aiSummary: apiDoc.aiSummary ?? undefined,
    ocrText: apiDoc.ocrText ?? undefined,
    s3Url: apiDoc.s3Url,
    s3Key: apiDoc.s3Key,
    mimeType: apiDoc.mimeType,
    signatureProgress: apiDoc.signatureProgress ?? null,
  };
}

export default function DocumentsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["documents", activeFilter, dateFrom, dateTo],
    queryFn: () =>
      fetchDocuments({
        type: activeFilter,
        sort: "newest",
        dateFrom,
        dateTo,
      }),
    refetchInterval: (query: any) => {
      const docs = query.state.data?.documents ?? [];
      const hasProcessing = docs.some((d: any) => d.status === "processing");
      return hasProcessing ? 5_000 : 60_000;
    },
  });

  const documents: Document[] = ((data as any)?.documents ?? []).map(mapApiDocToUi);
  const counts: Record<string, number> = (data as any)?.counts ?? {
    all: 0,
    invoice: 0,
    receipt: 0,
    contract: 0,
    delivery_note: 0,
    bill: 0,
  };

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

  const filteredDocuments =
    activeFilter === "all" ? documents : documents.filter((d) => d.type === activeFilter);

  const filterKeys = Object.keys(counts);

  function handleSelectDocument(doc: Document) {
    router.push(`/documents/${doc.id}`);
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <PageHeader title="Documents">
        <SearchInput onClick={() => setIsSearchOpen(true)} />
        <Button onClick={() => setIsUploadOpen(true)}>
          <Upload size={16} />
          Upload
        </Button>
      </PageHeader>

      {/* Filters row */}
      <div className="flex items-center justify-between px-8 py-3 border-b border-border">
        <FilterTabs
          activeKey={activeFilter}
          onChange={(key) => setActiveFilter(key)}
          tabs={filterKeys.map((key: string) => ({
            key,
            label: typePluralLabels[key] ?? key,
            count: counts[key] ?? 0,
          }))}
        />
        <div className="flex items-center gap-2">
          <DateRangePicker
            onChange={(range) => {
              setDateFrom(range?.from?.toISOString());
              setDateTo(range?.to?.toISOString());
            }}
          />
        </div>
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto px-8 py-2">
        <DocumentList
          documents={filteredDocuments.map((doc) => ({
            id: doc.id,
            description: doc.description,
            type: doc.type,
            status: doc.status,
            date: doc.date,
            thumbnailUrl: doc.thumbnailUrl,
            previewUrl: doc.previewUrl,
            signatureProgress: doc.signatureProgress,
          }))}
          loading={isLoading}
          emptyMessage="No documents found. Upload one to get started."
          onSelect={(item) => {
            const doc = filteredDocuments.find((d) => d.id === item.id);
            if (doc) handleSelectDocument(doc);
          }}
        />
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={() => refetch()}
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
