"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Upload, FileText, MoreVertical, ChevronDown, Check, Download, PenLine, Copy, Trash2 } from "lucide-react";
import { type Document } from "@/lib/mock-data";
import { fetchDocuments, updateDocument, API_URL } from "@/lib/api";
import { typeLabels, typePluralLabels, typeBadgeColors, statusBadgeColors, statusLabels, flagBadgeColors, flagLabels } from "@/lib/document-labels";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { FilterTabs } from "@/components/ui/filter-tabs";
import DocumentDetailModal from "@/components/document-detail-modal";
import UploadModal from "@/components/upload-modal";
import SearchModal from "@/components/search-modal";
import DocumentPreview from "@/components/document-preview";
import DateRangePicker from "@/components/date-range-picker";
import DocumentList from "@/components/document-list";

function ApproveButton({ documentId, approved: initialApproved }: { documentId: string; approved: boolean }) {
  const [approved, setApproved] = useState(initialApproved);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setApproved(initialApproved);
  }, [initialApproved]);

  async function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    setLoading(true);
    const next = !approved;
    try {
      await updateDocument(documentId, {
        isVerified: next,
        status: next ? "reviewed" : "pending",
      });
      setApproved(next);
    } catch {
      // revert on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
        approved
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-white border-[#EBEEF1] text-[#717983] hover:border-[#c4c9d1]"
      } ${loading ? "opacity-50" : ""}`}
    >
      <Check size={12} strokeWidth={3} />
      {approved ? "Approved" : "Approve"}
    </button>
  );
}

function CardDropdown({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-8 right-3 z-20 w-52 bg-white rounded-xl border border-[#EBEEF1] shadow-lg py-1.5"
    >
      <button
        type="button"
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#555A65] hover:bg-[#F8F8F8] transition-colors"
      >
        <Download size={14} />
        Download original
      </button>
      <button
        type="button"
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#555A65] hover:bg-[#F8F8F8] transition-colors"
      >
        <PenLine size={14} />
        Send for signing
      </button>
      <button
        type="button"
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#555A65] hover:bg-[#F8F8F8] transition-colors"
      >
        <Copy size={14} />
        Mark as duplicate
      </button>
      <div className="my-1.5 border-t border-[#EBEEF1]" />
      <button
        type="button"
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#DC2626] hover:bg-red-50 transition-colors"
      >
        <Trash2 size={14} />
        Move to bin
      </button>
    </div>
  );
}

function DocumentRow({
  doc,
  onSelect,
}: {
  doc: Document;
  onSelect: (doc: Document) => void;
}) {
  const isProcessing = doc.status === "processing";

  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 rounded-lg border border-transparent hover:border-[#EBEEF1] hover:bg-[#FAFAFA] cursor-pointer transition-all ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => !isProcessing && onSelect(doc)}
    >
      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-lg bg-[#F8F8F8] overflow-hidden flex-shrink-0">
        {isProcessing ? (
          <div className="w-full h-full bg-gradient-to-r from-[#EBEEF1] via-[#F8F8F8] to-[#EBEEF1] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        ) : doc.thumbnailUrl ? (
          <img
            src={doc.thumbnailUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#717983]">
            <FileText size={20} className="text-[#717983]" />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#212327] truncate">
          {doc.description}
        </p>
      </div>

      {/* Type badge */}
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0 ${typeBadgeColors[doc.type]}`}>
        {typeLabels[doc.type] ?? doc.type}
      </span>

      {/* Status badge */}
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0 ${statusBadgeColors[doc.status]}`}>
        {statusLabels[doc.status]}
      </span>

      {/* Date */}
      <span className="text-xs text-[#717983] w-24 text-right flex-shrink-0">
        {doc.date}
      </span>

      {/* Approve */}
      <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <ApproveButton documentId={doc.id} approved={doc.approved} />
      </div>
    </div>
  );
}

function mapApiDocToUi(apiDoc: any): Document {
  const flags: Document["flags"] = [];
  if (apiDoc.isVerified) flags.push("verified");
  if (apiDoc.isDuplicate) flags.push("duplicate");
  // Also support flags already in the mock format
  if (Array.isArray(apiDoc.flags)) {
    for (const f of apiDoc.flags) {
      if (f === "verified" || f === "duplicate") {
        if (!flags.includes(f)) flags.push(f);
      }
    }
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
        })
      : "",
    approved: apiDoc.status === "reviewed" || apiDoc.isVerified === true,
    thumbnailUrl: apiDoc.thumbnailUrl
      ? apiDoc.thumbnailUrl.startsWith("/")
        ? `${API_URL}${apiDoc.thumbnailUrl}`
        : apiDoc.thumbnailUrl
      : undefined,
    extractedData: apiDoc.extractedData ?? undefined,
    aiSummary: apiDoc.aiSummary ?? undefined,
    aiFlags: apiDoc.flags
      ? Array.isArray(apiDoc.flags)
        ? apiDoc.flags.filter(
            (f: any) => typeof f === "object" && f.type && f.message
          )
        : undefined
      : undefined,
    ocrText: apiDoc.ocrText ?? undefined,
    s3Url: apiDoc.s3Url,
    s3Key: apiDoc.s3Key,
    mimeType: apiDoc.mimeType,
  };
}

export default function DocumentsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({ all: 0, invoice: 0, receipt: 0, contract: 0, delivery_note: 0, bill: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const loadDocuments = useCallback(
    async (type?: string) => {
      try {
        setLoading(true);
        const data = await fetchDocuments({
          type: type ?? activeFilter,
          sort: "newest",
          dateFrom,
          dateTo,
        });
        const mapped = (data.documents ?? []).map(mapApiDocToUi);
        setDocuments(mapped);
        if (data.counts) {
          setCounts(data.counts);
        }
      } catch {
        setDocuments([]);
        setCounts({ all: 0, invoice: 0, receipt: 0, contract: 0, delivery_note: 0, bill: 0 });
      } finally {
        setLoading(false);
      }
    },
    [activeFilter, dateFrom, dateTo]
  );

  // Initial load
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

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

  function handleFilterChange(key: string) {
    setActiveFilter(key);
    loadDocuments(key);
  }

  const filterKeys = Object.keys(counts);

  const filteredDocuments =
    activeFilter === "all"
      ? documents
      : documents.filter((d) => d.type === activeFilter);

  function handleSelectDocument(doc: Document) {
    router.push(`/documents/${doc.id}`);
  }

  function handleRefresh() {
    loadDocuments();
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <PageHeader title="Documents" icon={<FileText size={20} />}>
        <SearchInput onClick={() => setIsSearchOpen(true)} />
        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors"
        >
          <Upload size={16} />
          Upload
        </button>
      </PageHeader>

      {/* Filters row */}
      <div className="flex items-center justify-between px-8 py-3 border-b border-[#EBEEF1]">
        <FilterTabs
          activeKey={activeFilter}
          onChange={handleFilterChange}
          tabs={filterKeys.map(key => ({ key, label: typePluralLabels[key] ?? key, count: counts[key] ?? 0 }))}
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
          }))}
          loading={loading}
          emptyMessage="No documents found. Upload one to get started."
          onSelect={(item) => {
            const doc = filteredDocuments.find((d) => d.id === item.id);
            if (doc) handleSelectDocument(doc);
          }}
          actions={(item) => {
            const doc = filteredDocuments.find((d) => d.id === item.id);
            if (!doc) return null;
            return <ApproveButton documentId={doc.id} approved={doc.approved} />;
          }}
        />
      </div>

      {/* Modals */}
      <DocumentDetailModal
        document={selectedDocument}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onApprove={handleRefresh}
      />
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={handleRefresh}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
