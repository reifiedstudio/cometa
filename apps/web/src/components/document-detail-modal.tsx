"use client";

import { useEffect, useState } from "react";
import type { Document } from "@/lib/mock-data";
import { updateDocument } from "@/lib/api";

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
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document && window.addEventListener("keydown", handleKeyDown);
      document && (window.document.body.style.overflow = "hidden");
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "";
    };
  }, [isOpen, onClose, document]);

  if (!isOpen || !document) return null;

  const doc = document;
  const data = doc.extractedData;
  const flags = doc.aiFlags ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-4xl bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEEF1]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#F8F8F8] text-[#555A65] transition-colors"
            >
              <CloseIcon />
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
            <div className="w-full h-full min-h-[500px] bg-[#F8F8F8] rounded-xl border border-[#EBEEF1] flex items-center justify-center">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <DocumentPreviewIcon />
                </div>
                <p className="text-sm text-[#717983]">Document preview</p>
                <p className="text-xs text-[#717983] mt-1">
                  {doc.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="w-[42%] p-6 pl-0 space-y-6 overflow-y-auto">
            {/* AI Summary */}
            {doc.aiSummary && (
              <div className="bg-[#FFFBEB] rounded-xl p-4 border border-[#FDE68A]">
                <div className="flex items-center gap-2 mb-2.5">
                  <SparkleIcon />
                  <h3 className="text-sm font-semibold text-[#212327]">
                    AI Summary
                  </h3>
                </div>
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
            {data && (
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold text-[#212327]">
                  Extracted Data
                </h3>
                <div className="bg-white rounded-xl border border-[#EBEEF1] p-4">
                  {data.supplier && (
                    <ExtractedDataRow label="Supplier" value={data.supplier} />
                  )}
                  {data.invoiceNo && (
                    <ExtractedDataRow
                      label="Invoice No."
                      value={data.invoiceNo}
                    />
                  )}
                  {data.date && (
                    <ExtractedDataRow label="Date" value={data.date} />
                  )}
                  {data.paymentTerms && (
                    <ExtractedDataRow
                      label="Payment Terms"
                      value={data.paymentTerms}
                    />
                  )}
                  {data.subtotal && (
                    <ExtractedDataRow
                      label="Subtotal"
                      value={data.subtotal}
                      isMoney
                    />
                  )}
                  {data.vat && (
                    <ExtractedDataRow
                      label="VAT (15%)"
                      value={data.vat}
                      isMoney
                    />
                  )}
                  {data.total && (
                    <ExtractedDataRow
                      label="Total"
                      value={data.total}
                      isMoney
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#EBEEF1]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={approving}
              onClick={async () => {
                if (!doc) return;
                setApproving(true);
                try {
                  await updateDocument(doc.id, { status: "reviewed" });
                  onApprove?.();
                  onClose();
                } catch (err) {
                  console.error("Failed to approve document:", err);
                } finally {
                  setApproving(false);
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors disabled:opacity-50"
            >
              <CheckIcon />
              {approving ? "Approving..." : "Approve"}
            </button>
            <button
              type="button"
              onClick={() => {
                const url = doc.s3Url;
                if (url) {
                  window.open(url, "_blank");
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#555A65] bg-white border border-[#EBEEF1] rounded-lg hover:bg-[#F8F8F8] transition-colors"
            >
              <DownloadIcon />
              Download
            </button>
          </div>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-[#F8F8F8] text-[#717983] transition-colors"
          >
            <MoreDotsIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
