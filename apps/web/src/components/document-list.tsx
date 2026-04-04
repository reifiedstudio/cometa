"use client";

import { API_URL } from "@/lib/api";

export interface DocumentListItem {
  id: string;
  description: string | null;
  originalName?: string;
  type: string;
  status: string;
  date: string;
  thumbnailUrl?: string;
}

const typeBadgeColors: Record<string, string> = {
  invoice: "bg-orange-50 text-orange-600",
  receipt: "bg-emerald-50 text-emerald-600",
  contract: "bg-blue-50 text-blue-600",
  delivery_note: "bg-red-50 text-red-600",
  bill: "bg-sky-50 text-sky-600",
};

const typeLabels: Record<string, string> = {
  invoice: "Invoice",
  receipt: "Receipt",
  contract: "Contract",
  delivery_note: "Delivery Note",
  bill: "Bill",
};

const statusBadgeColors: Record<string, string> = {
  reviewed: "text-gray-500",
  pending: "text-orange-500",
  processing: "text-blue-500",
  rejected: "text-red-500",
  overdue: "text-red-500",
  awaiting_signature: "text-blue-500",
};

const statusLabels: Record<string, string> = {
  reviewed: "Reviewed",
  pending: "Pending",
  processing: "Processing",
  rejected: "Rejected",
  overdue: "Overdue",
  awaiting_signature: "Awaiting Signature",
};

interface DocumentListProps {
  documents: DocumentListItem[];
  loading?: boolean;
  emptyMessage?: string;
  onSelect?: (doc: DocumentListItem) => void;
  actions?: (doc: DocumentListItem) => React.ReactNode;
}

export default function DocumentList({
  documents,
  loading,
  emptyMessage = "No documents",
  onSelect,
  actions,
}: DocumentListProps) {
  if (loading) {
    return (
      <div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 border-b border-[#F0F0F0]">
            <div className="w-9 h-9 rounded-md bg-gradient-to-r from-[#EBEEF1] via-[#F8F8F8] to-[#EBEEF1] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-48 bg-[#EBEEF1] rounded animate-pulse" />
              <div className="h-3 w-24 bg-[#EBEEF1] rounded animate-pulse" />
            </div>
            <div className="h-3 w-16 bg-[#EBEEF1] rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#717983]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <p className="mt-3 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {documents.map((doc) => {
        const isProcessing = doc.status === "processing";
        const thumbSrc = doc.thumbnailUrl
          ? doc.thumbnailUrl.startsWith("/")
            ? `${API_URL}${doc.thumbnailUrl}`
            : doc.thumbnailUrl
          : null;

        return (
          <div
            key={doc.id}
            className={`group flex items-center gap-3 px-3 py-2.5 border-b border-[#F0F0F0] last:border-b-0 transition-colors ${
              isProcessing
                ? "opacity-50"
                : onSelect
                  ? "cursor-pointer hover:bg-[#FAFAFA]"
                  : ""
            }`}
            onClick={() => !isProcessing && onSelect?.(doc)}
          >
            {/* Thumbnail */}
            <div className="w-9 h-9 rounded-md bg-[#F5F5F5] overflow-hidden flex-shrink-0">
              {isProcessing ? (
                <div className="w-full h-full bg-gradient-to-r from-[#EBEEF1] via-[#F8F8F8] to-[#EBEEF1] bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
              ) : thumbSrc ? (
                <img src={thumbSrc} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#C4C9D1]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#212327] truncate">
                {doc.description ?? doc.originalName ?? "Untitled"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[11px] font-medium ${typeBadgeColors[doc.type] ? statusBadgeColors[doc.status] : "text-[#717983]"}`}>
                  {typeLabels[doc.type] ?? doc.type}
                </span>
                <span className="text-[#D1D5DB]">·</span>
                <span className={`text-[11px] ${statusBadgeColors[doc.status] ?? "text-[#717983]"}`}>
                  {statusLabels[doc.status] ?? doc.status}
                </span>
                <span className="text-[#D1D5DB]">·</span>
                <span className="text-[11px] text-[#717983]">{doc.date}</span>
              </div>
            </div>

            {/* Actions */}
            {actions && (
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                {actions(doc)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
