"use client";

import DocumentPreview from "@/components/document-preview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TypeBadge } from "@/components/ui/type-badge";
import {
  API_URL,
  deleteDocument,
  fetchAuditLogs,
  fetchDocument,
  fetchDocumentTypes,
  reprocessDocument,
  restoreDocument,
  updateDocument,
} from "@/lib/api";
import type { Document } from "@/lib/types";
import { useDocumentTypes } from "@/lib/use-document-types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Flag,
  PenLine,
  RotateCcw,
  Trash2,
  UserX,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function ExtractedDataRow({
  label,
  value,
  isMoney,
  fieldType,
  onSave,
}: {
  label: string;
  value: string;
  isMoney?: boolean;
  fieldType?: string;
  onSave?: (newValue: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState("");

  function validate(v: string): boolean {
    if (!fieldType || !v) return true;
    if (fieldType === "currency" || fieldType === "number") {
      if (isNaN(Number(v))) {
        setError("Must be a number");
        return false;
      }
    }
    if (fieldType === "date") {
      if (isNaN(new Date(v).getTime())) {
        setError("Must be a valid date");
        return false;
      }
    }
    setError("");
    return true;
  }

  function handleSave() {
    if (!validate(editValue)) return;
    setEditing(false);
    setError("");
    if (editValue !== value && onSave) {
      // Coerce to number for currency/number fields
      if ((fieldType === "currency" || fieldType === "number") && editValue) {
        onSave(String(Number(editValue)));
      } else {
        onSave(editValue);
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditValue(value);
      setError("");
      setEditing(false);
    }
  }

  const inputType =
    fieldType === "currency" || fieldType === "number"
      ? "number"
      : fieldType === "date"
        ? "date"
        : "text";

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      {editing ? (
        <div className="flex flex-col items-end">
          <input
            type={inputType}
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              setError("");
            }}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            step={inputType === "number" ? "any" : undefined}
            autoFocus
            className={cn(
              "text-sm text-foreground text-right bg-transparent border-b outline-none px-1 py-0 min-w-[60px] max-w-[60%]",
              error ? "border-red-500" : "border-foreground",
            )}
          />
          {error && <span className="text-[10px] text-red-500 mt-0.5">{error}</span>}
        </div>
      ) : (
        <span
          onClick={() => {
            if (onSave) {
              setEditValue(value);
              setEditing(true);
            }
          }}
          className={cn(
            "text-sm text-foreground",
            isMoney && "font-semibold",
            onSave && "cursor-pointer hover:bg-muted rounded px-1 -mx-1 transition-colors",
          )}
        >
          {value}
        </span>
      )}
    </div>
  );
}

interface DocumentDetailProps {
  documentId: string;
  onClose?: () => void;
}

export default function DocumentDetail({ documentId, onClose }: DocumentDetailProps) {
  const router = useRouter();
  const id = documentId;
  const handleClose = useCallback(() => {
    if (onClose) onClose();
    else router.push("/documents");
  }, [onClose, router]);

  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState<string | null>(null);
  const [notifySender, setNotifySender] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditRefresh, setAuditRefresh] = useState(0);
  const [typeConfig, setTypeConfig] = useState<{ fields: any[]; itemColumns?: any[] } | null>(null);
  const { labels: typeLabels } = useDocumentTypes();

  const loadDocument = useCallback(async () => {
    try {
      const data = await fetchDocument(id);
      setDoc(data);
      setAuditRefresh((n) => n + 1);
    } catch {
      toast.error("Failed to load document");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  // Load audit logs when activity tab is selected
  useEffect(() => {
    if (activeTab !== "activity" || !id) return;
    setAuditLoading(true);
    fetchAuditLogs(id)
      .then((data) => setAuditLogs(data.logs ?? []))
      .catch(() => {})
      .finally(() => setAuditLoading(false));
  }, [activeTab, id, auditRefresh]);

  // Load document type config for field display
  useEffect(() => {
    if (!doc?.type) return;
    fetchDocumentTypes()
      .then((data) => {
        const match = (data.types ?? []).find((t: any) => t.slug === doc.type);
        if (match) {
          const fields = (match.fields as any[]).filter((f: any) => f.type !== "table");
          const tableField = (match.fields as any[]).find((f: any) => f.type === "table");
          setTypeConfig({
            fields: fields.map((f: any) => ({
              key: f.key,
              label: f.label,
              fieldType: f.type as string,
              isMoney: f.type === "currency",
            })),
            ...(tableField
              ? {
                  itemColumns: (tableField.columns ?? []).map((c: any) => ({
                    key: c.key,
                    label: c.label,
                    align: c.align ?? "left",
                    isMoney: c.isMoney ?? false,
                  })),
                }
              : {}),
          });
        }
      })
      .catch(() => {});
  }, [doc?.type]);

  if (loading) {
    return <LoadingSpinner className="flex-1" />;
  }

  if (!doc) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <EmptyState icon={<FileText size={48} strokeWidth={1} />} message="Document not found" />
        <Button
          variant="link"
          onClick={() => handleClose()}
          className="text-sm text-foreground underline"
        >
          Back to documents
        </Button>
      </div>
    );
  }

  const isRejected = doc.status === "rejected";
  const isApproved = doc.status === "approved" || doc.status === "reviewed";
  const isLocked = isRejected || isApproved;
  const flags = doc.flags ?? [];
  const config = typeConfig;
  const extractedData = doc.extractedData;

  const handleFieldSave = async (key: string, newValue: string) => {
    if (!doc) return;
    const current = (doc.extractedData as Record<string, unknown>) ?? {};
    const updated = { ...current, [key]: newValue };
    try {
      await updateDocument(doc.id, { extractedData: updated });
      setDoc((prev) => (prev ? ({ ...prev, extractedData: updated } as Document) : prev));
      setAuditRefresh((n) => n + 1);
    } catch {
      toast.error("Failed to save field");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDocument(doc.id);
      toast.success("Document deleted");
      handleClose();
      router.refresh();
    } catch {
      toast.error("Failed to delete document");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => handleClose()}>
            <ArrowLeft size={16} />
            Back
          </Button>
          <div className="w-px h-5 bg-border" />
          <span className="text-sm text-muted-foreground">Documents</span>
          <ChevronRight size={14} className="text-muted-foreground/30" />
          <h1 className="text-sm font-semibold text-foreground truncate max-w-[300px]">
            {doc.description || doc.id}
          </h1>
          <StatusBadge status={doc.status} />
          {(doc as any).isFlagged && (
            <Badge className="gap-1 bg-orange-100 text-orange-700 border-transparent text-[11px]">
              <Flag size={10} />
              Flagged
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "inline-flex items-center rounded-lg border overflow-hidden",
              isLocked && "opacity-50 pointer-events-none",
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              disabled={isLocked}
              onClick={() => {
                setSelectedType(doc.type ?? null);
                setShowTypeModal(true);
              }}
              className="rounded-none border-0"
            >
              <FileText size={14} />
              {typeLabels[doc.type ?? ""] ?? doc.type ?? "Unknown"}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isLocked}
              onClick={async () => {
                try {
                  await reprocessDocument(doc.id);
                  toast.success("Reprocessing started");
                  loadDocument();
                } catch {
                  toast.error("Failed to reprocess");
                }
              }}
              className="rounded-none border-0 border-l border-border"
            >
              <RotateCcw size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Left - Document preview */}
        <div className="w-[55%] p-6 overflow-y-auto bg-muted">
          <div className="w-full max-w-[85%] mx-auto bg-card rounded-xl shadow-sm border overflow-hidden">
            <DocumentPreview
              previewUrl={(doc as any).previewUrl ?? null}
              mimeType={doc.mimeType ?? ""}
              alt={doc.description}
            />
          </div>
        </div>

        {/* Right - Details panel */}
        <div className="w-[45%] flex flex-col border-l border-border">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={cn(
                "flex-1 py-3 text-sm font-medium text-center transition-colors",
                activeTab === "details"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-muted-foreground",
              )}
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("activity")}
              className={cn(
                "flex-1 py-3 text-sm font-medium text-center transition-colors",
                activeTab === "activity"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-muted-foreground",
              )}
            >
              Activity
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "details" && (
              <>
                {/* Rejected banner */}
                {doc.status === "rejected" &&
                  (() => {
                    const updatedAt = (doc as any).updatedAt
                      ? new Date((doc as any).updatedAt)
                      : null;
                    const daysLeft = updatedAt
                      ? Math.max(
                          0,
                          90 -
                            Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)),
                        )
                      : 90;
                    return (
                      <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-red-50 border border-red-200">
                        <div>
                          <p className="text-sm font-medium text-red-800">
                            This document has been rejected
                          </p>
                          <p className="text-xs text-red-600 mt-0.5">
                            It will be permanently deleted in {daysLeft}{" "}
                            {daysLeft === 1 ? "day" : "days"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await restoreDocument(doc.id);
                              toast.success("Document restored");
                              loadDocument();
                            } catch {
                              toast.error("Failed to restore document");
                            }
                          }}
                          className="text-red-700 border-red-200 hover:bg-red-50 flex-shrink-0"
                        >
                          <RotateCcw size={12} />
                          Restore
                        </Button>
                      </div>
                    );
                  })()}

                {/* Approved banner */}
                {isApproved && (
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div>
                      <p className="text-sm font-medium text-emerald-800">
                        This document has been approved
                      </p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        Fields are locked. Reopen to make changes.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          await updateDocument(doc.id, { status: "pending" });
                          toast.success("Document reopened");
                          loadDocument();
                        } catch {
                          toast.error("Failed to reopen document");
                        }
                      }}
                      className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 flex-shrink-0"
                    >
                      <RotateCcw size={12} />
                      Reopen
                    </Button>
                  </div>
                )}

                {/* AI Summary */}
                {doc.aiSummary && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{doc.aiSummary}</p>
                  </div>
                )}

                {/* Source info */}
                {((doc as any).senderEmail || (doc as any).source) && (
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                    {(doc as any).senderEmail && (
                      <span>
                        From:{" "}
                        <span className="text-foreground font-medium">
                          {(doc as any).senderEmail}
                        </span>
                      </span>
                    )}
                    {(doc as any).source && (
                      <span>
                        Source:{" "}
                        <span className="text-foreground font-medium capitalize">
                          {(doc as any).source}
                        </span>
                      </span>
                    )}
                    {doc.receivedAt && (
                      <span>
                        Received:{" "}
                        <span className="text-foreground font-medium">
                          {new Date(doc.receivedAt).toLocaleDateString("en-ZA", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                    )}
                  </div>
                )}

                {/* Flags */}
                {flags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">Flags</h3>
                    {flags.map((flag, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-2.5 p-3 rounded-lg border",
                          flag.type === "warning"
                            ? "bg-orange-50 border-orange-200"
                            : "bg-emerald-50 border-emerald-200",
                        )}
                      >
                        <p
                          className={cn(
                            "text-sm",
                            flag.type === "warning" ? "text-orange-800" : "text-emerald-800",
                          )}
                        >
                          {flag.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extracted Data */}
                {extractedData && Object.keys(extractedData).length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="text-sm font-semibold text-foreground">Details</h3>
                    <div className="bg-card rounded-xl border p-4">
                      {config
                        ? config.fields
                            .filter((f) => {
                              const val = (extractedData as Record<string, unknown>)[f.key];
                              return val != null && val !== "";
                            })
                            .map((f) => {
                              const val = (extractedData as Record<string, unknown>)[f.key];
                              const display = Array.isArray(val) ? val.join(", ") : String(val);
                              return (
                                <ExtractedDataRow
                                  key={f.key}
                                  label={f.label}
                                  value={display}
                                  isMoney={f.isMoney}
                                  fieldType={f.fieldType}
                                  onSave={isLocked ? undefined : (v) => handleFieldSave(f.key, v)}
                                />
                              );
                            })
                        : Object.entries(extractedData)
                            .filter(([, v]) => v != null && v !== "" && typeof v !== "object")
                            .map(([k, v]) => (
                              <ExtractedDataRow
                                key={k}
                                label={k}
                                value={String(v)}
                                onSave={
                                  isLocked ? undefined : (newVal) => handleFieldSave(k, newVal)
                                }
                              />
                            ))}
                    </div>

                    {/* Line items */}
                    {Array.isArray((extractedData as Record<string, unknown>).items) &&
                      ((extractedData as Record<string, unknown>).items as unknown[]).length > 0 &&
                      config?.itemColumns && (
                        <div className="space-y-2.5 mt-4">
                          <h3 className="text-sm font-semibold text-foreground">Line Items</h3>
                          <div className="bg-card rounded-xl border overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b bg-muted">
                                  {config.itemColumns.map((col) => (
                                    <th
                                      key={col.key}
                                      className={cn(
                                        "py-2 px-4 text-muted-foreground font-medium",
                                        col.align === "right" ? "text-right" : "text-left",
                                      )}
                                    >
                                      {col.label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {(
                                  (extractedData as Record<string, unknown>).items as Record<
                                    string,
                                    unknown
                                  >[]
                                ).map((item, i) => (
                                  <tr key={i}>
                                    {config.itemColumns!.map((col) => (
                                      <td
                                        key={col.key}
                                        className={cn(
                                          "py-2 px-4",
                                          col.align === "right" && "text-right",
                                          col.isMoney
                                            ? "font-semibold text-foreground"
                                            : "text-muted-foreground",
                                        )}
                                      >
                                        {item[col.key] != null ? String(item[col.key]) : ""}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* OCR Text */}
                {doc.ocrText && (
                  <details className="group">
                    <summary className="flex items-center gap-1.5 text-sm font-semibold text-foreground cursor-pointer hover:text-muted-foreground transition-colors">
                      <ChevronRight
                        size={14}
                        className="transition-transform group-open:rotate-90"
                      />
                      OCR Text
                    </summary>
                    <div className="mt-2 bg-card rounded-xl border p-4">
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
                        {doc.ocrText}
                      </pre>
                    </div>
                  </details>
                )}
              </>
            )}

            {activeTab === "activity" && (
              <div className="space-y-1">
                {auditLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-5 h-5 border-2 border-border border-t-foreground rounded-full animate-spin" />
                  </div>
                ) : auditLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p className="text-sm">No activity yet</p>
                    <p className="text-xs mt-1">Actions on this document will appear here</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
                    {auditLogs.map((log) => {
                      const date = new Date(log.createdAt);
                      const timeStr = date.toLocaleString("en-ZA", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      // Determine icon and color based on action
                      let iconBg = "bg-muted";
                      let iconEl = <RotateCcw size={11} className="text-muted-foreground" />;

                      switch (log.action) {
                        case "status_changed":
                          if (log.newValue === "approved" || log.newValue === "reviewed") {
                            iconBg = "bg-emerald-100";
                            iconEl = <Check size={11} className="text-emerald-600" />;
                          } else if (log.newValue === "rejected") {
                            iconBg = "bg-red-100";
                            iconEl = <X size={11} className="text-red-600" />;
                          }
                          break;
                        case "flagged":
                        case "unflagged":
                          iconBg = "bg-orange-100";
                          iconEl = <Flag size={11} className="text-orange-600" />;
                          break;
                        case "type_changed":
                          iconBg = "bg-blue-100";
                          iconEl = <FileText size={11} className="text-blue-600" />;
                          break;
                        case "reprocessed":
                          iconBg = "bg-purple-100";
                          iconEl = <RotateCcw size={11} className="text-purple-600" />;
                          break;
                        case "trashed":
                          iconBg = "bg-red-100";
                          iconEl = <Trash2 size={11} className="text-red-600" />;
                          break;
                        case "restored":
                          iconBg = "bg-emerald-100";
                          iconEl = <RotateCcw size={11} className="text-emerald-600" />;
                          break;
                        case "signature_requested":
                        case "signature_resent":
                          iconBg = "bg-indigo-100";
                          iconEl = <PenLine size={11} className="text-indigo-600" />;
                          break;
                        case "document_signed":
                        case "all_signed":
                          iconBg = "bg-emerald-100";
                          iconEl = <PenLine size={11} className="text-emerald-600" />;
                          break;
                        case "signer_removed":
                          iconBg = "bg-red-100";
                          iconEl = <UserX size={11} className="text-red-600" />;
                          break;
                        case "due_date_changed":
                          iconBg = "bg-blue-100";
                          iconEl = <Clock size={11} className="text-blue-600" />;
                          break;
                        case "description_changed":
                        case "fields_edited":
                          iconBg = "bg-muted";
                          iconEl = <PenLine size={11} className="text-muted-foreground" />;
                          break;
                      }

                      return (
                        <div key={log.id} className="relative flex gap-3 py-2.5 pl-1">
                          <div
                            className={cn(
                              "relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0",
                              iconBg,
                            )}
                          >
                            {iconEl}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{log.detail}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-muted-foreground/60">
                                {timeStr}
                              </span>
                              {log.userEmail && (
                                <span className="text-[11px] text-muted-foreground/60">
                                  {log.userEmail}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom action bar */}
          <TooltipProvider>
            <div className="flex items-center justify-between px-6 py-3 border-t border-border">
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (doc.s3Url) window.open(doc.s3Url, "_blank");
                        }}
                      />
                    }
                  >
                    <Download size={16} />
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>

                {!isLocked && (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async () => {
                            const newFlagged = !(doc as any).isFlagged;
                            try {
                              await updateDocument(doc.id, { isFlagged: newFlagged });
                              toast.success(newFlagged ? "Document flagged" : "Flag removed");
                              loadDocument();
                            } catch {
                              toast.error("Failed to update flag");
                            }
                          }}
                          className={cn(
                            (doc as any).isFlagged &&
                              "text-orange-500 bg-orange-50 hover:bg-orange-100",
                          )}
                        />
                      }
                    >
                      <Flag size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      {(doc as any).isFlagged ? "Remove flag" : "Flag for review"}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isRejected ? (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        await restoreDocument(doc.id);
                        toast.success("Document restored");
                        loadDocument();
                      } catch {
                        toast.error("Failed to restore document");
                      }
                    }}
                  >
                    <RotateCcw size={16} />
                    Restore
                  </Button>
                ) : isApproved ? (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        await updateDocument(doc.id, { status: "pending" });
                        toast.success("Document reopened");
                        loadDocument();
                      } catch {
                        toast.error("Failed to reopen document");
                      }
                    }}
                  >
                    <RotateCcw size={16} />
                    Reopen
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRejectReason(null);
                        setNotifySender(false);
                        setShowRejectModal(true);
                      }}
                      className="bg-red-50 text-red-700 border-red-200/60 hover:bg-red-100 hover:border-red-300/70"
                    >
                      <Trash2 size={16} />
                      Reject
                    </Button>

                    <Button
                      disabled={approving}
                      onClick={async () => {
                        setApproving(true);
                        try {
                          await updateDocument(doc.id, { status: "approved" });
                          toast.success("Document approved");
                          loadDocument();
                        } catch {
                          toast.error("Failed to approve");
                        } finally {
                          setApproving(false);
                        }
                      }}
                      className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100 hover:border-emerald-300/70"
                    >
                      <Check size={16} />
                      {approving ? "Approving..." : "Approve"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject modal */}
      <AlertDialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject document</AlertDialogTitle>
            <AlertDialogDescription>
              This document will be moved to the bin. You can restore it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reason <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "invalid", label: "Invalid document" },
                  { key: "poor_quality", label: "Poor quality" },
                  { key: "missing_info", label: "Missing info" },
                  { key: "duplicate", label: "Duplicate" },
                  { key: "wrong_type", label: "Wrong type" },
                  { key: "other", label: "Other" },
                ].map((reason) => (
                  <button
                    key={reason.key}
                    type="button"
                    onClick={() => setRejectReason(rejectReason === reason.key ? null : reason.key)}
                    className={cn(
                      "px-3 py-2 text-sm rounded-lg border transition-colors text-left",
                      rejectReason === reason.key
                        ? "border-red-300 bg-red-50 text-red-700 font-medium"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
            </div>

            {rejectReason && (doc as any).senderEmail && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted border">
                <div>
                  <p className="text-sm font-medium text-foreground">Notify sender</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Send rejection email to {(doc as any).senderEmail}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifySender(!notifySender)}
                  className={cn(
                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                    notifySender ? "bg-foreground" : "bg-border",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform",
                      notifySender ? "translate-x-[18px]" : "translate-x-[3px]",
                    )}
                  />
                </button>
              </div>
            )}

            {rejectReason && !(doc as any).senderEmail && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted border">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notify sender</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    No sender email on this document
                  </p>
                </div>
                <button
                  type="button"
                  disabled
                  className="relative inline-flex h-5 w-9 items-center rounded-full bg-muted cursor-not-allowed"
                >
                  <span className="inline-block h-3.5 w-3.5 rounded-full bg-white translate-x-[3px]" />
                </button>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={rejecting}
              onClick={async () => {
                setRejecting(true);
                try {
                  await updateDocument(doc.id, {
                    status: "rejected",
                    ...(rejectReason ? { rejectionReason: rejectReason } : {}),
                    ...(notifySender ? { notifySender: true } : {}),
                  });
                  toast.success(
                    rejectReason
                      ? `Rejected: ${rejectReason.replace(/_/g, " ")}`
                      : "Document rejected",
                  );
                  loadDocument();
                } catch {
                  toast.error("Failed to reject");
                } finally {
                  setRejecting(false);
                  setShowRejectModal(false);
                }
              }}
            >
              {rejecting ? "Rejecting..." : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change type modal */}
      <AlertDialog open={showTypeModal} onOpenChange={setShowTypeModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change document type</AlertDialogTitle>
            <AlertDialogDescription>
              Select a new type. This will reprocess the document with the new extraction schema.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid grid-cols-2 gap-2 py-2">
            {Object.entries(typeLabels).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedType(value)}
                className={cn(
                  "px-3 py-2.5 text-sm rounded-lg border transition-colors text-left",
                  selectedType === value
                    ? "border-foreground bg-muted text-foreground font-medium"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!selectedType || selectedType === doc?.type}
              onClick={async () => {
                if (!selectedType) return;
                try {
                  await updateDocument(doc!.id, { type: selectedType });
                  toast.success("Type updated, reprocessing...");
                  await reprocessDocument(doc!.id);
                  loadDocument();
                } catch {
                  toast.error("Failed to update type");
                }
                setShowTypeModal(false);
              }}
            >
              Change & Reprocess
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
