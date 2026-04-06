"use client";

import { FileText } from "lucide-react";
import { API_URL } from "@/lib/api";
import {
  typeBadgeColors,
  typeLabels,
  statusBadgeColors,
  statusLabels,
} from "@/lib/document-labels";
import { SkeletonList } from "@/components/ui/skeleton-list";
import { EmptyState } from "@/components/ui/empty-state";

export interface DocumentListItem {
  id: string;
  description: string | null;
  originalName?: string;
  type: string;
  status: string;
  date: string;
  thumbnailUrl?: string;
}

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
    return <SkeletonList />;
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={48} strokeWidth={1} />}
        message={emptyMessage}
      />
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
                <div className="w-full h-full flex items-center justify-center">
                  <FileText size={16} className="text-[#C4C9D1]" />
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
