"use client";

import { statusLabels, typeLabels } from "@/lib/document-labels";
import { AlertTriangle, Check, Clock, Eye, FileText, Loader, PenLine, X } from "lucide-react";

/** Strip a leading "Receipt - " / "Receipt: " / "Receipt " prefix from the title
 *  so we don't render the type twice once it's shown inline before the title. */
function stripTypePrefix(title: string, typeLabel?: string): string {
  if (!typeLabel) return title;
  const re = new RegExp(`^${typeLabel}\\s*[-:·]?\\s*`, "i");
  return title.replace(re, "") || title;
}

// ── Type label colours (text-only, used inline before the title) ──
const typeTextColors: Record<string, string> = {
  invoice: "text-orange-600",
  receipt: "text-emerald-600",
  contract: "text-blue-600",
  delivery_note: "text-red-600",
  bill: "text-sky-600",
};

// ── Status icon + colour for the thumbnail badge ──
const statusBadge: Record<
  string,
  { icon: React.ComponentType<{ size?: number; className?: string }>; bg: string }
> = {
  approved: { icon: Check, bg: "bg-emerald-500" },
  pending: { icon: Clock, bg: "bg-orange-500" },
  processing: { icon: Loader, bg: "bg-blue-500" },
  reviewed: { icon: Eye, bg: "bg-gray-500" },
  rejected: { icon: X, bg: "bg-red-500" },
  overdue: { icon: AlertTriangle, bg: "bg-red-500" },
  awaiting_signature: { icon: PenLine, bg: "bg-blue-500" },
};
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonList } from "@/components/ui/skeleton-list";
import { cn } from "@/lib/utils";

export interface DocumentListItem {
  id: string;
  description: string | null;
  originalName?: string;
  type: string;
  status: string;
  date: string;
  thumbnailUrl?: string;
  previewUrl?: string | null;
  signatureProgress?: { signed: number; total: number } | null;
}

interface DocumentListProps {
  documents: DocumentListItem[];
  loading?: boolean;
  emptyMessage?: string;
  onSelect?: (doc: DocumentListItem) => void;
  /** Custom actions — renders on the right side of each row */
  actions?: (doc: DocumentListItem) => React.ReactNode;
  /** Group rows under "This month" / "Last month" headers. Defaults to true. */
  groupByMonth?: boolean;
  /** When provided, replaces the trailing date column. Use for inline meta like "3d overdue". */
  trailing?: (doc: DocumentListItem) => React.ReactNode;
}

function getMonthKey(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
}

function isThisMonth(dateStr: string): boolean {
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return false;
  const now = new Date();
  return parsed.getMonth() === now.getMonth() && parsed.getFullYear() === now.getFullYear();
}

function isLastMonth(dateStr: string): boolean {
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return false;
  const last = new Date();
  last.setMonth(last.getMonth() - 1);
  return parsed.getMonth() === last.getMonth() && parsed.getFullYear() === last.getFullYear();
}

function getMonthLabel(dateStr: string): string {
  if (isThisMonth(dateStr)) return "This month";
  if (isLastMonth(dateStr)) return "Last month";
  return getMonthKey(dateStr);
}

export default function DocumentList({
  documents,
  loading,
  emptyMessage = "No documents",
  onSelect,
  actions,
  groupByMonth = true,
  trailing,
}: DocumentListProps) {
  if (loading) {
    return <SkeletonList />;
  }

  if (documents.length === 0) {
    return <EmptyState icon={<FileText size={48} strokeWidth={1} />} message={emptyMessage} />;
  }

  // Group documents by month (or a single ungrouped bucket)
  const groups: { label: string; key: string; docs: DocumentListItem[] }[] = [];
  if (groupByMonth) {
    let currentKey = "";
    for (const doc of documents) {
      const key = getMonthKey(doc.date);
      if (key !== currentKey) {
        currentKey = key;
        groups.push({ label: getMonthLabel(doc.date), key, docs: [] });
      }
      groups[groups.length - 1].docs.push(doc);
    }
  } else {
    groups.push({ label: "", key: "all", docs: documents });
  }

  return (
    <div>
      {groups.map((group, gi) => (
        <div key={group.key}>
          {/* Month divider */}
          {groupByMonth && (
            <div
              className={cn("flex items-center gap-3 px-3", gi === 0 ? "pt-2 pb-2" : "pt-6 pb-2")}
            >
              <span className="text-xs font-semibold text-foreground">{group.label}</span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted-foreground/60">{group.docs.length}</span>
            </div>
          )}

          {/* Documents */}
          {group.docs.map((doc) => {
            const isProcessing = doc.status === "processing";
            const thumbSrc = doc.previewUrl ?? doc.thumbnailUrl ?? null;

            return (
              <div
                key={doc.id}
                className={cn(
                  "group flex items-center gap-3.5 px-3 py-3 rounded-lg transition-colors",
                  isProcessing ? "opacity-50" : onSelect ? "cursor-pointer hover:bg-muted" : "",
                )}
                onClick={() => !isProcessing && onSelect?.(doc)}
              >
                {/* Thumbnail with status badge */}
                <div className="relative w-10 h-10 flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden ring-1 ring-black/[0.04]">
                    {isProcessing ? (
                      <div className="w-full h-full bg-gradient-to-r from-border via-muted to-border bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
                    ) : thumbSrc ? (
                      <img src={thumbSrc} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText size={16} className="text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  {(() => {
                    const badge = statusBadge[doc.status];
                    if (!badge) return null;
                    const Icon = badge.icon;
                    return (
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-card text-white",
                          badge.bg,
                          doc.status === "processing" && "animate-spin",
                        )}
                        title={statusLabels[doc.status] ?? doc.status}
                      >
                        <Icon size={9} className="stroke-[3]" />
                      </div>
                    );
                  })()}
                </div>

                {/* Type · Title (+ optional signature progress) */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate leading-tight">
                    <span
                      className={cn(
                        "font-semibold",
                        typeTextColors[doc.type] ?? "text-muted-foreground",
                      )}
                    >
                      {typeLabels[doc.type] ?? doc.type}
                    </span>
                    <span className="text-muted-foreground/40 mx-1.5">·</span>
                    <span className="text-foreground">
                      {stripTypePrefix(
                        doc.description ?? doc.originalName ?? "Untitled",
                        typeLabels[doc.type],
                      )}
                    </span>
                  </p>
                  {doc.signatureProgress && doc.signatureProgress.total > 0 && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <PenLine size={10} />
                      {doc.signatureProgress.signed === doc.signatureProgress.total
                        ? `All ${doc.signatureProgress.total} signed`
                        : `${doc.signatureProgress.signed} of ${doc.signatureProgress.total} signed · ${doc.signatureProgress.total - doc.signatureProgress.signed} left`}
                    </p>
                  )}
                </div>

                {/* Trailing slot — custom node, or default to date */}
                {trailing ? (
                  <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {trailing(doc)}
                  </div>
                ) : (
                  <span className="text-[11px] text-muted-foreground/60 tabular-nums flex-shrink-0 text-right hidden sm:block">
                    {doc.date}
                  </span>
                )}

                {/* Actions */}
                {actions && !isProcessing && (
                  <div
                    className="flex items-center gap-1 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions(doc)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
