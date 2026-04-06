"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Document } from "@/lib/mock-data";
import { updateDocument, deleteDocument, reprocessDocument, API_URL } from "@/lib/api";
import { toast } from "sonner";
import SignatureModal from "@/components/signature-modal";
import SignatureStatus from "@/components/signature-status";
import { displayConfig as displayConfigs } from "@cometa/shared";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const typeLabels: Record<Document["type"], string> = {
  invoice: "Invoice",
  receipt: "Receipt",
  contract: "Contract",
  delivery_note: "Delivery Note",
  bill: "Bill",
};

const typeBadgeColors: Record<Document["type"], string> = {
  invoice: "bg-orange-100 text-orange-700",
  receipt: "bg-emerald-100 text-emerald-700",
  contract: "bg-blue-100 text-blue-700",
  delivery_note: "bg-red-100 text-red-700",
  bill: "bg-sky-100 text-sky-700",
};

const statusLabels: Record<Document["status"], string> = {
  reviewed: "Reviewed",
  pending: "Pending Review",
  processing: "Processing",
  rejected: "Rejected",
  overdue: "Overdue",
  awaiting_signature: "Awaiting Signature",
};

const statusBadgeColors: Record<Document["status"], string> = {
  reviewed: "bg-gray-100 text-gray-600",
  pending: "bg-orange-100 text-orange-600",
  processing: "bg-blue-100 text-blue-600",
  rejected: "bg-red-100 text-red-600",
  overdue: "bg-red-100 text-red-600",
  awaiting_signature: "bg-blue-100 text-blue-600",
};

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D09305"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#EA580C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#16A349"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DownloadIcon() {
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
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function MoreDotsIcon() {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </svg>
  );
}

function DocumentPreviewIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#717983"
      strokeWidth="1"
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

function ExtractedDataRow({ label, value, fieldKey, isMoney, onSave }: {
  label: string;
  value: string;
  fieldKey: string;
  isMoney?: boolean;
  onSave?: (key: string, value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  return (
    <div className="group flex items-center justify-between py-2 border-b border-[#EBEEF1] last:border-b-0">
      <span className="text-sm text-[#555A65]">{label}</span>
      <div className="flex items-center gap-1.5">
        {editing ? (
          <>
            <input
              ref={inputRef}
              type={isMoney ? "number" : "text"}
              step={isMoney ? "0.01" : undefined}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { onSave?.(fieldKey, editValue); setEditing(false); }
                if (e.key === "Escape") { setEditValue(value); setEditing(false); }
              }}
              className="text-sm text-[#212327] text-right bg-[#F8F8F8] border border-[#EBEEF1] rounded px-2 py-0.5 w-40 outline-none focus:border-[#212327]"
            />
            <button
              type="button"
              onClick={() => { onSave?.(fieldKey, editValue); setEditing(false); }}
              className="text-emerald-600 hover:text-emerald-700 p-0.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => { setEditValue(value); setEditing(false); }}
              className="text-[#717983] hover:text-red-500 p-0.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <span className={`text-sm text-[#212327] ${isMoney ? "font-semibold" : ""}`}>
              {value}
            </span>
            {onSave && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="opacity-0 group-hover:opacity-100 text-[#717983] hover:text-[#212327] p-0.5 transition-opacity"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ExtractedDataSection({ data, docType, documentId, onSave }: {
  data: Record<string, unknown>;
  docType: string;
  documentId: string;
  onSave?: () => void;
}) {
  const config = displayConfigs[docType as keyof typeof displayConfigs];

  const handleFieldSave = async (key: string, value: string) => {
    const fieldConfig = config?.fields.find((f) => f.key === key);
    const updatedData = { ...data };
    updatedData[key] = fieldConfig?.isMoney ? Number(value) : value;
    try {
      await updateDocument(documentId, { extractedData: updatedData });
      toast.success("Field updated");
      onSave?.();
    } catch (err) {
      toast.error("Failed to save field");
    }
  };

  if (!config) {
    const entries = Object.entries(data).filter(
      ([, v]) => v != null && v !== "" && typeof v !== "object"
    );
    if (entries.length === 0) return null;
    return (
      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold text-[#212327]">Details</h3>
        <div className="bg-white rounded-xl border border-[#EBEEF1] p-4">
          {entries.map(([k, v]) => (
            <ExtractedDataRow key={k} label={k} fieldKey={k} value={String(v)} onSave={handleFieldSave} />
          ))}
        </div>
      </div>
    );
  }

  const fieldRows = config.fields
    .filter((f) => {
      const val = data[f.key];
      if (val == null) return false;
      if (Array.isArray(val)) return val.length > 0;
      return val !== "";
    })
    .map((f) => {
      const val = data[f.key];
      const display = Array.isArray(val) ? val.join(", ") : String(val);
      return (
        <ExtractedDataRow
          key={f.key}
          label={f.label}
          fieldKey={f.key}
          value={display}
          isMoney={f.isMoney}
          onSave={handleFieldSave}
        />
      );
    });

  const items = Array.isArray(data.items) ? (data.items as Record<string, unknown>[]) : null;
  const cols = config.itemColumns;

  return (
    <div className="space-y-4">
      {fieldRows.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-semibold text-[#212327]">Details</h3>
          <div className="bg-white rounded-xl border border-[#EBEEF1] p-4">
            {fieldRows}
          </div>
        </div>
      )}

      {items && items.length > 0 && cols && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-semibold text-[#212327]">Line Items</h3>
          <div className="bg-white rounded-xl border border-[#EBEEF1] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EBEEF1] bg-[#F8F8F8]">
                  {cols.map((col) => (
                    <th
                      key={col.key}
                      className={`py-2 px-4 text-[#555A65] font-medium ${col.align === "right" ? "text-right" : "text-left"}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-[#EBEEF1] last:border-b-0">
                    {cols.map((col) => {
                      const val = item[col.key];
                      return (
                        <td
                          key={col.key}
                          className={`py-2 px-4 ${col.align === "right" ? "text-right" : ""} ${col.isMoney ? "font-semibold text-[#212327]" : "text-[#555A65]"}`}
                        >
                          {val != null ? String(val) : ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

interface DocumentDetailModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
}

export default function DocumentDetailModal({
  document,
  isOpen,
  onClose,
  onApprove,
}: DocumentDetailModalProps) {
  const [approving, setApproving] = useState(false);
  const [showOcrText, setShowOcrText] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureStatusKey, setSignatureStatusKey] = useState(0);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  }, [onClose]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    if (isOpen) {
      document && window.addEventListener("keydown", handleKeyDown);
      document && (window.document.body.style.overflow = "hidden");
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "";
    };
  }, [isOpen, handleClose, document]);

  if (!isOpen || !document) return null;

  const doc = document;
  const data = doc.extractedData;
  const flags = doc.aiFlags ?? [];

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDocument(doc.id);
      toast.success("Document deleted");
      onApprove?.();
      handleClose();
    } catch (err) {
      toast.error("Failed to delete document");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-250 ${closing ? "opacity-0" : "opacity-100"}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className={`relative w-[calc(100%-60px)] bg-white shadow-2xl flex flex-col rounded-l-2xl ${closing ? "animate-slide-out-right" : "animate-slide-in-right"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEEF1]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#EBEEF1] bg-white hover:bg-[#F8F8F8] transition-colors text-[#717983]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="text-xs font-medium">ESC</span>
            </button>
            <h2 className="text-lg font-semibold text-[#212327]">
              Document Detail
            </h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeColors[doc.status]}`}>
              {statusLabels[doc.status]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={doc.type}
              onValueChange={async (newType) => {
                if (!newType) return;
                try {
                  await updateDocument(doc.id, { type: newType as Document["type"] });
                  toast.success("Document type updated");
                  onApprove?.();
                } catch (err) {
                  toast.error("Failed to update type");
                }
              }}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={async () => {
                try {
                  await reprocessDocument(doc.id);
                  toast.success("Reprocessing started");
                  onApprove?.();
                } catch (err) {
                  toast.error("Failed to reprocess document");
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#555A65] bg-white border border-[#EBEEF1] rounded-lg hover:bg-[#F8F8F8] transition-colors"
              title="Re-run AI classification"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Reprocess
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex min-h-0">
          {/* Left - Document preview */}
          <div className="w-[58%] p-8 overflow-y-auto bg-white">
            <div className="w-full max-w-[90%] mx-auto bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-center overflow-hidden">
              {doc.s3Key ? (
                <img
                  src={`${API_URL}/api/files/${doc.s3Key}`}
                  alt={doc.description}
                  className="w-full rounded-lg shadow-lg"
                />
              ) : (
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <DocumentPreviewIcon />
                  </div>
                  <p className="text-sm text-[#717983]">Document preview</p>
                  <p className="text-xs text-[#717983] mt-1">
                    {doc.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Details */}
          <div className="w-[42%] flex flex-col">
          <div className="flex-1 p-6 pl-8 space-y-6 overflow-y-auto border-l border-[#EBEEF1]">
            {/* Description */}
            {doc.aiSummary && (
              <div>
                <h3 className="text-sm font-semibold text-[#212327] mb-2">
                  Description
                </h3>
                <p className="text-sm text-[#555A65] leading-relaxed">
                  {doc.aiSummary}
                </p>
              </div>
            )}

            {/* Flags */}
            {flags.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold text-[#212327]">Flags</h3>
                <div className="space-y-2">
                  {flags.map((flag, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                        flag.type === "warning"
                          ? "bg-orange-50 border-orange-200"
                          : "bg-emerald-50 border-emerald-200"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {flag.type === "warning" ? (
                          <WarningIcon />
                        ) : (
                          <SuccessIcon />
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          flag.type === "warning"
                            ? "text-orange-800"
                            : "text-emerald-800"
                        }`}
                      >
                        {flag.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Data */}
            {doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
              <ExtractedDataSection data={doc.extractedData} docType={doc.type} documentId={doc.id} onSave={() => onApprove?.()} />
            )}
            {/* Signature Status */}
            <SignatureStatus key={signatureStatusKey} documentId={doc.id} />

            {/* OCR Text */}
            {doc.ocrText && (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowOcrText(!showOcrText)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#212327] hover:text-[#555A65] transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${showOcrText ? "rotate-90" : ""}`}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  OCR Text
                </button>
                {showOcrText && (
                  <div className="bg-white rounded-xl border border-[#EBEEF1] p-4">
                    <pre className="text-xs text-[#555A65] whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
                      {doc.ocrText}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#EBEEF1]">
            <TooltipProvider>
              <div className="flex items-center gap-0 -ml-6">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={() => {
                          const url = doc.s3Url;
                          if (url) {
                            window.open(url, "_blank");
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#555A65] hover:bg-[#F8F8F8] rounded-lg transition-colors"
                      />
                    }
                  >
                    <DownloadIcon />
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#555A65] hover:bg-[#F8F8F8] rounded-lg transition-colors"
                      />
                    }
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>

                <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete document</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this document? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#555A65] hover:bg-[#F8F8F8] rounded-lg transition-colors"
                      />
                    }
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" y1="22" x2="4" y2="15" />
                    </svg>
                  </TooltipTrigger>
                  <TooltipContent>Flag for review</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={() => setShowSignatureModal(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#555A65] hover:bg-[#F8F8F8] rounded-lg transition-colors"
                      />
                    }
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </TooltipTrigger>
                  <TooltipContent>Send for Signature</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await updateDocument(doc.id, { status: "rejected" });
                    toast.success("Document rejected");
                    onApprove?.();
                    handleClose();
                  } catch (err) {
                    toast.error("Failed to reject document");
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-[#EBEEF1] rounded-lg hover:bg-red-50 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Reject
              </button>
              <button
                type="button"
                disabled={approving}
                onClick={async () => {
                  if (!doc) return;
                  setApproving(true);
                  try {
                    await updateDocument(doc.id, { status: "reviewed" });
                    toast.success("Document approved");
                    onApprove?.();
                    handleClose();
                  } catch (err) {
                    toast.error("Failed to approve document");
                  } finally {
                    setApproving(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors disabled:opacity-50"
              >
                <CheckIcon />
                {approving ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        documentId={doc.id}
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSuccess={() => {
          setSignatureStatusKey((k) => k + 1);
          onApprove?.();
        }}
      />
    </div>
  );
}
