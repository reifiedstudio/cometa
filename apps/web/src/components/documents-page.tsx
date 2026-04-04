"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { type Document } from "@/lib/mock-data";
import { fetchDocuments, updateDocument, API_URL } from "@/lib/api";
import DocumentDetailModal from "@/components/document-detail-modal";
import UploadModal from "@/components/upload-modal";
import SearchModal from "@/components/search-modal";
import DocumentPreview from "@/components/document-preview";
import DateRangePicker from "@/components/date-range-picker";

const typeLabels: Record<string, string> = {
  all: "All",
  invoice: "Invoices",
  receipt: "Receipts",
  contract: "Contracts",
  delivery_note: "Delivery Notes",
  bill: "Bills",
};

const typeBadgeColors: Record<Document["type"], string> = {
  invoice: "bg-orange-100 text-orange-700",
  receipt: "bg-emerald-100 text-emerald-700",
  contract: "bg-blue-100 text-blue-700",
  delivery_note: "bg-red-100 text-red-700",
  bill: "bg-sky-100 text-sky-700",
};

const statusBadgeColors: Record<Document["status"], string> = {
  reviewed: "bg-gray-100 text-gray-600",
  pending: "bg-orange-100 text-orange-600",
  processing: "bg-blue-100 text-blue-600",
  rejected: "bg-red-100 text-red-600",
  overdue: "bg-red-100 text-red-600",
  awaiting_signature: "bg-blue-100 text-blue-600",
};

const statusLabels: Record<Document["status"], string> = {
  reviewed: "Reviewed",
  pending: "Pending",
  processing: "Processing",
  rejected: "Rejected",
  overdue: "Overdue",
  awaiting_signature: "Awaiting Signature",
};

const flagBadgeColors: Record<string, string> = {
  verified: "bg-emerald-100 text-emerald-600",
  duplicate: "bg-red-100 text-red-600",
};

const flagLabels: Record<string, string> = {
  verified: "Verified",
  duplicate: "Dup",
};

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#717983"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon({ approved }: { approved: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={approved ? "#16a34a" : "#c4c9d1"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

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
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {approved ? "Approved" : "Approve"}
    </button>
  );
}

function DownloadSmallIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
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
        <DownloadSmallIcon />
        Download original
      </button>
      <button
        type="button"
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#555A65] hover:bg-[#F8F8F8] transition-colors"
      >
        <PenIcon />
        Send for signing
      </button>
      <button
        type="button"
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#555A65] hover:bg-[#F8F8F8] transition-colors"
      >
        <CopyIcon />
        Mark as duplicate
      </button>
      <div className="my-1.5 border-t border-[#EBEEF1]" />
      <button
        type="button"
        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#DC2626] hover:bg-red-50 transition-colors"
      >
        <TrashIcon />
        Move to bin
      </button>
    </div>
  );
}

function DocumentCard({
  doc,
  onSelect,
}: {
  doc: Document;
  onSelect: (doc: Document) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const isProcessing = doc.status === "processing";

  return (
    <div className={`rounded-xl border border-[#EBEEF1] bg-white overflow-hidden transition-opacity ${isProcessing ? "opacity-60 pointer-events-none" : ""}`}>
      {/* Thumbnail */}
      <div
        className="relative h-[200px] bg-[#F8F8F8] flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => !isProcessing && onSelect(doc)}
      >
        {isProcessing ? (
          <div className="w-full h-full bg-gradient-to-r from-[#EBEEF1] via-[#F8F8F8] to-[#EBEEF1] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        ) : doc.thumbnailUrl ? (
          <img
            src={doc.thumbnailUrl}
            alt={doc.description}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <DocumentIcon />
        )}
        {!isProcessing && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="absolute top-3 right-3 p-1.5 rounded-md bg-white border border-[#EBEEF1] shadow-sm hover:bg-[#F8F8F8] text-[#717983]"
          >
            <MoreIcon />
          </button>
        )}
        {showMenu && <CardDropdown onClose={() => setShowMenu(false)} />}
      </div>

      {/* Content */}
      <div
        className="p-3.5 space-y-2.5 cursor-pointer"
        onClick={() => !isProcessing && onSelect(doc)}
      >
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${typeBadgeColors[doc.type]}`}
          >
            {typeLabels[doc.type] ?? doc.type}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeColors[doc.status]}`}
          >
            {statusLabels[doc.status]}
          </span>
          {doc.flags.map((flag) => (
            <span
              key={flag}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${flagBadgeColors[flag]}`}
            >
              {flagLabels[flag]}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm font-semibold text-[#212327] leading-snug line-clamp-2">
          {doc.description}
        </p>

        {/* Date + approve */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#717983]">{doc.date}</span>
          <ApproveButton documentId={doc.id} approved={doc.approved} />
        </div>
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
    setSelectedDocument(doc);
    setIsDetailOpen(true);
  }

  function handleRefresh() {
    loadDocuments();
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#EBEEF1]">
        <h1 className="text-xl font-semibold text-[#212327]">Documents</h1>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#717983]">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              readOnly
              onClick={() => setIsSearchOpen(true)}
              className="pl-9 pr-14 py-2 w-64 text-sm rounded-lg border border-[#EBEEF1] bg-white text-[#212327] placeholder:text-[#717983] focus:outline-none focus:ring-2 focus:ring-[#D09305]/30 focus:border-[#D09305] cursor-pointer"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-[#717983] bg-[#F8F8F8] border border-[#EBEEF1] rounded">
                ⌘K
              </kbd>
            </div>
          </div>
          {/* Upload button */}
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors"
          >
            <UploadIcon />
            Upload
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center justify-between px-8 py-3 border-b border-[#EBEEF1]">
        <div className="flex items-center gap-2">
          {filterKeys.map((key) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleFilterChange(key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? "bg-[#212327] text-white"
                    : "bg-[#F8F8F8] text-[#555A65] hover:bg-[#EBEEF1]"
                }`}
              >
                {typeLabels[key]}{" "}
                <span className={isActive ? "text-white/70" : "text-[#717983]"}>
                  {counts[key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker
            onChange={(range) => {
              setDateFrom(range?.from?.toISOString());
              setDateTo(range?.to?.toISOString());
            }}
          />
        </div>
      </div>

      {/* Document grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-[#EBEEF1] bg-white overflow-hidden">
                <div className="h-[200px] bg-gradient-to-r from-[#EBEEF1] via-[#F8F8F8] to-[#EBEEF1] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
                <div className="p-3.5 space-y-2.5">
                  <div className="flex gap-1.5">
                    <div className="h-5 w-16 bg-[#EBEEF1] rounded-full animate-pulse" />
                    <div className="h-5 w-14 bg-[#EBEEF1] rounded-full animate-pulse" />
                  </div>
                  <div className="h-4 w-3/4 bg-[#EBEEF1] rounded animate-pulse" />
                  <div className="flex justify-between">
                    <div className="h-3 w-20 bg-[#EBEEF1] rounded animate-pulse" />
                    <div className="h-6 w-16 bg-[#EBEEF1] rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onSelect={handleSelectDocument}
              />
            ))}
          </div>
        )}
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
