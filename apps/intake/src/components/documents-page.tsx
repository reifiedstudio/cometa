"use client";

import DateRangePicker from "@/components/date-range-picker";
import DocumentList from "@/components/document-list";
import SearchModal from "@/components/search-modal";
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { SearchInput } from "@/components/ui/search-input";
import UploadModal from "@/components/upload-modal";
import { AppPage } from "@cometa/ui/app-page";
import { CollectionProvider, CollectionView, CollectionItem, ViewToggle } from "@cometa/ui/collection-view";
import { Badge } from "@cometa/ui/ui/badge";
import { fetchDocuments } from "@/lib/api";
import { typeLabels, typePluralLabels, typeBadgeColors, statusLabels, statusBadgeColors } from "@/lib/document-labels";
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
    <CollectionProvider>
    <AppPage
      breadcrumbs={[{ label: "Intake" }, { label: "Documents" }]}
      title="Documents"
      description={`${counts.all ?? 0} documents`}
      actions={
        <>
          <ViewToggle />
          <SearchInput onClick={() => setIsSearchOpen(true)} />
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload size={16} />
            Upload
          </Button>
        </>
      }
      noPadding
    >
      {/* Filters row */}
      <div className="flex items-center justify-between px-6 py-3 border-b shrink-0">
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
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading ? null : !filteredDocuments.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <FileText className="size-8 mb-3 opacity-40" />
            <p className="text-sm">No documents found. Upload one to get started.</p>
          </div>
        ) : (
          <CollectionView pageSize={12}>
            {filteredDocuments.map((doc) => (
              <CollectionItem
                key={doc.id}
                title={doc.description || doc.type}
                timestamp={doc.date}
                relativeTime={false}
                href={`/documents/${doc.id}`}
                badge={
                  <Badge className={`border text-[11px] ${typeBadgeColors[doc.type] ?? "bg-muted text-muted-foreground"}`}>
                    {typeLabels[doc.type] ?? doc.type}
                  </Badge>
                }
                footer={
                  <Badge variant="secondary" className={`text-xs ${statusBadgeColors[doc.status] ?? ""}`}>
                    {statusLabels[doc.status] ?? doc.status}
                  </Badge>
                }
              />
            ))}
          </CollectionView>
        )}
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={() => refetch()}
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </AppPage>
    </CollectionProvider>
  );
}
