"use client";

import { useCallback, useEffect, useState } from "react";
import type { Document } from "@/lib/mock-data";
import { updateDocument, API_URL } from "@/lib/api";

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
  overdue: "Overdue",
  awaiting_signature: "Awaiting Signature",
};

const statusBadgeColors: Record<Document["status"], string> = {
  reviewed: "bg-gray-100 text-gray-600",
  pending: "bg-orange-100 text-orange-600",
  processing: "bg-blue-100 text-blue-600",
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

interface ExtractedDataRowProps {
  label: string;
  value: string;
  isMoney?: boolean;
}

function ExtractedDataRow({ label, value, isMoney }: ExtractedDataRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#EBEEF1] last:border-b-0">
      <span className="text-sm text-[#555A65]">{label}</span>
      <span
        className={`text-sm text-[#212327] ${isMoney ? "font-semibold" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function isMoneyField(key: string): boolean {
  return /total|subtotal|tax|tip|amount|price|vat|cost|fee/i.test(key);
}

function ExtractedDataSection({ data }: { data: Record<string, unknown> }) {
  const scalarFields: [string, string][] = [];
  const lineItems: Record<string, unknown>[] | null =
    Array.isArray(data.items) && data.items.length > 0 && typeof data.items[0] === "object"
      ? (data.items as Record<string, unknown>[])
      : null;
  const nestedFields: [string, Record<string, unknown>][] = [];

  for (const [key, value] of Object.entries(data)) {
    if (key === "items" && lineItems) continue;
    if (value == null || value === "") continue;
    if (typeof value === "object" && !Array.isArray(value)) {
      nestedFields.push([key, value as Record<string, unknown>]);
    } else if (typeof value !== "object") {
      scalarFields.push([key, String(value)]);
    }
  }

  return (
    <div className="space-y-4">
      {/* Scalar fields */}
      {scalarFields.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-semibold text-[#212327]">Details</h3>
          <div className="bg-white rounded-xl border border-[#EBEEF1] p-4">
            {scalarFields.map(([key, value]) => (
              <ExtractedDataRow
                key={key}
                label={formatLabel(key)}
                value={value}
                isMoney={isMoneyField(key)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Line items */}
      {lineItems && (
        <div className="space-y-2.5">
          <h3 className="text-sm font-semibold text-[#212327]">Line Items</h3>
          <div className="bg-white rounded-xl border border-[#EBEEF1] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EBEEF1] bg-[#F8F8F8]">
                  <th className="text-left py-2 px-4 text-[#555A65] font-medium">Item</th>
                  <th className="text-right py-2 px-4 text-[#555A65] font-medium">Qty</th>
                  <th className="text-right py-2 px-4 text-[#555A65] font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, i) => (
                  <tr key={i} className="border-b border-[#EBEEF1] last:border-b-0">
                    <td className="py-2 px-4 text-[#212327]">
                      {String(item.name ?? item.description ?? item.item ?? "")}
                    </td>
                    <td className="py-2 px-4 text-right text-[#555A65]">
                      {String(item.quantity ?? item.qty ?? 1)}
                    </td>
                    <td className="py-2 px-4 text-right font-semibold text-[#212327]">
                      {String(item.totalPrice ?? item.unitPrice ?? item.price ?? item.amount ?? "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Nested objects (e.g. payment info) */}
      {nestedFields.map(([key, obj]) => (
        <div key={key} className="space-y-2.5">
          <h3 className="text-sm font-semibold text-[#212327]">{formatLabel(key)}</h3>
          <div className="bg-white rounded-xl border border-[#EBEEF1] p-4">
            {Object.entries(obj)
              .filter(([, v]) => v != null && v !== "" && typeof v !== "object")
              .map(([k, v]) => (
                <ExtractedDataRow
                  key={k}
                  label={formatLabel(k)}
                  value={String(v)}
                  isMoney={isMoneyField(k)}
                />
              ))}
          </div>
        </div>
      ))}
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
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${typeBadgeColors[doc.type]}`}
            >
              {typeLabels[doc.type]}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusBadgeColors[doc.status]}`}
            >
              {statusLabels[doc.status]}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex min-h-0">
          {/* Left - Document preview */}
          <div className="w-[58%] p-6">
            <div className="w-full h-full min-h-[500px] bg-[#F8F8F8] rounded-xl border border-[#EBEEF1] flex items-center justify-center overflow-hidden">
              {doc.s3Key ? (
                <img
                  src={`${API_URL}/api/files/${doc.s3Key}`}
                  alt={doc.description}
                  className="w-full h-full object-contain"
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
          <div className="flex-1 p-6 pl-0 space-y-6 overflow-y-auto">
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
              <ExtractedDataSection data={doc.extractedData} />
            )}
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Download"
                onClick={() => {
                  const url = doc.s3Url;
                  if (url) {
                    window.open(url, "_blank");
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#555A65] hover:bg-[#F8F8F8] rounded-lg transition-colors"
              >
                <DownloadIcon />
              </button>
              <button
                type="button"
                title="Delete"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#555A65] hover:bg-[#F8F8F8] rounded-lg transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
              <button
                type="button"
                title="Flag for review"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#555A65] hover:bg-[#F8F8F8] rounded-lg transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              disabled={approving}
              onClick={async () => {
                if (!doc) return;
                setApproving(true);
                try {
                  await updateDocument(doc.id, { status: "reviewed" });
                  onApprove?.();
                  handleClose();
                } catch (err) {
                  console.error("Failed to approve document:", err);
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
  );
}
