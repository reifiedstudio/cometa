"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchDocument, updateDocument, deleteDocument, reprocessDocument, API_URL } from "@/lib/api";
import { toast } from "sonner";
import { displayConfig as displayConfigs } from "@cometa/shared";
import SignatureModal from "@/components/signature-modal";
import SignatureStatus from "@/components/signature-status";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Document } from "@/lib/mock-data";
import {
  ArrowLeft,
  Download,
  Trash2,
  Flag,
  PenLine,
  RotateCcw,
  Check,
  X,
  FileText,
  ChevronRight,
} from "lucide-react";
import { typeLabels } from "@/lib/document-labels";
import { TypeBadge } from "@/components/ui/type-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";

function ExtractedDataRow({
  label,
  value,
  isMoney,
}: {
  label: string;
  value: string;
  isMoney?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#EBEEF1] last:border-b-0">
      <span className="text-sm text-[#555A65]">{label}</span>
      <span className={`text-sm text-[#212327] ${isMoney ? "font-semibold" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureStatusKey, setSignatureStatusKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"details" | "signatures">("details");

  const loadDocument = useCallback(async () => {
    try {
      const data = await fetchDocument(id);
      setDoc(data);
    } catch {
      toast.error("Failed to load document");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  if (loading) {
    return <LoadingSpinner className="flex-1" />;
  }

  if (!doc) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <EmptyState icon={<FileText size={48} strokeWidth={1} />} message="Document not found" />
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-sm text-[#212327] underline"
        >
          Back to documents
        </button>
      </div>
    );
  }

  const flags = doc.aiFlags ?? [];
  const config = displayConfigs[doc.type as keyof typeof displayConfigs];
  const extractedData = doc.extractedData;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDocument(doc.id);
      toast.success("Document deleted");
      router.push("/");
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
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#EBEEF1]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-[#717983] hover:text-[#212327] hover:bg-[#F8F8F8] rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="w-px h-5 bg-[#EBEEF1]" />
          <span className="text-sm text-[#717983]">Documents</span>
          <ChevronRight size={14} className="text-[#EBEEF1]" />
          <h1 className="text-sm font-semibold text-[#212327] truncate max-w-[300px]">
            {doc.description || doc.id}
          </h1>
          <TypeBadge type={doc.type} />
          <StatusBadge status={doc.status} />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={doc.type}
            onValueChange={async (newType) => {
              if (!newType) return;
              try {
                await updateDocument(doc.id, { type: newType });
                toast.success("Type updated");
                loadDocument();
              } catch {
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
                loadDocument();
              } catch {
                toast.error("Failed to reprocess");
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#555A65] bg-white border border-[#EBEEF1] rounded-lg hover:bg-[#F8F8F8] transition-colors"
          >
            <RotateCcw size={14} />
            Reprocess
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Left - Document preview */}
        <div className="w-[55%] p-6 overflow-y-auto bg-[#FAFAFA]">
          <div className="w-full max-w-[85%] mx-auto bg-white rounded-xl shadow-sm border border-[#EBEEF1] overflow-hidden">
            {doc.s3Key && doc.mimeType ? (
              <DocumentPreview s3Key={doc.s3Key} mimeType={doc.mimeType} alt={doc.description} />
            ) : doc.s3Key ? (
              <img
                src={`${API_URL}/api/files/${doc.s3Key}`}
                alt={doc.description}
                className="w-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-[#717983]">
                <FileText size={64} strokeWidth={1} />
                <p className="text-sm mt-3">No preview available</p>
              </div>
            )}
          </div>
        </div>

        {/* Right - Details panel */}
        <div className="w-[45%] flex flex-col border-l border-[#EBEEF1]">
          {/* Tabs */}
          <div className="flex border-b border-[#EBEEF1]">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                activeTab === "details"
                  ? "text-[#212327] border-b-2 border-[#212327]"
                  : "text-[#717983] hover:text-[#555A65]"
              }`}
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("signatures")}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                activeTab === "signatures"
                  ? "text-[#212327] border-b-2 border-[#212327]"
                  : "text-[#717983] hover:text-[#555A65]"
              }`}
            >
              Signatures
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "details" && (
              <>
                {/* AI Summary */}
                {doc.aiSummary && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#212327] mb-2">Description</h3>
                    <p className="text-sm text-[#555A65] leading-relaxed">{doc.aiSummary}</p>
                  </div>
                )}

                {/* Flags */}
                {flags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-[#212327]">Flags</h3>
                    {flags.map((flag, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                          flag.type === "warning"
                            ? "bg-orange-50 border-orange-200"
                            : "bg-emerald-50 border-emerald-200"
                        }`}
                      >
                        <p className={`text-sm ${flag.type === "warning" ? "text-orange-800" : "text-emerald-800"}`}>
                          {flag.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extracted Data */}
                {extractedData && Object.keys(extractedData).length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="text-sm font-semibold text-[#212327]">Details</h3>
                    <div className="bg-white rounded-xl border border-[#EBEEF1] p-4">
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
                                />
                              );
                            })
                        : Object.entries(extractedData)
                            .filter(([, v]) => v != null && v !== "" && typeof v !== "object")
                            .map(([k, v]) => (
                              <ExtractedDataRow key={k} label={k} value={String(v)} />
                            ))}
                    </div>

                    {/* Line items */}
                    {Array.isArray((extractedData as Record<string, unknown>).items) && ((extractedData as Record<string, unknown>).items as unknown[]).length > 0 && config?.itemColumns && (
                      <div className="space-y-2.5 mt-4">
                        <h3 className="text-sm font-semibold text-[#212327]">Line Items</h3>
                        <div className="bg-white rounded-xl border border-[#EBEEF1] overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-[#EBEEF1] bg-[#F8F8F8]">
                                {config.itemColumns.map((col) => (
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
                              {((extractedData as Record<string, unknown>).items as Record<string, unknown>[]).map((item, i) => (
                                <tr key={i} className="border-b border-[#EBEEF1] last:border-b-0">
                                  {config.itemColumns!.map((col) => (
                                    <td
                                      key={col.key}
                                      className={`py-2 px-4 ${col.align === "right" ? "text-right" : ""} ${col.isMoney ? "font-semibold text-[#212327]" : "text-[#555A65]"}`}
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
                    <summary className="flex items-center gap-1.5 text-sm font-semibold text-[#212327] cursor-pointer hover:text-[#555A65] transition-colors">
                      <ChevronRight size={14} className="transition-transform group-open:rotate-90" />
                      OCR Text
                    </summary>
                    <div className="mt-2 bg-white rounded-xl border border-[#EBEEF1] p-4">
                      <pre className="text-xs text-[#555A65] whitespace-pre-wrap font-mono max-h-[300px] overflow-y-auto">
                        {doc.ocrText}
                      </pre>
                    </div>
                  </details>
                )}
              </>
            )}

            {activeTab === "signatures" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#212327]">Signature Requests</h3>
                  <button
                    type="button"
                    onClick={() => setShowSignatureModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors"
                  >
                    <PenLine size={13} />
                    Send for Signature
                  </button>
                </div>
                <SignatureStatus key={signatureStatusKey} documentId={doc.id} />
              </div>
            )}
          </div>

          {/* Bottom action bar */}
          <TooltipProvider>
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#EBEEF1]">
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={() => {
                          if (doc.s3Url) window.open(doc.s3Url, "_blank");
                        }}
                        className="inline-flex items-center justify-center w-9 h-9 text-[#555A65] hover:bg-[#F8F8F8] rounded-lg transition-colors"
                      />
                    }
                  >
                    <Download size={16} />
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center justify-center w-9 h-9 text-[#555A65] hover:bg-[#F8F8F8] rounded-lg transition-colors"
                      />
                    }
                  >
                    <Trash2 size={16} />
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-9 h-9 text-[#555A65] hover:bg-[#F8F8F8] rounded-lg transition-colors"
                      />
                    }
                  >
                    <Flag size={16} />
                  </TooltipTrigger>
                  <TooltipContent>Flag for review</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("signatures");
                          setShowSignatureModal(true);
                        }}
                        className="inline-flex items-center justify-center w-9 h-9 text-[#555A65] hover:bg-[#F8F8F8] rounded-lg transition-colors"
                      />
                    }
                  >
                    <PenLine size={16} />
                  </TooltipTrigger>
                  <TooltipContent>Send for Signature</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await updateDocument(doc.id, { status: "rejected" });
                      toast.success("Document rejected");
                      loadDocument();
                    } catch {
                      toast.error("Failed to reject");
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-[#EBEEF1] rounded-lg hover:bg-red-50 transition-colors"
                >
                  <X size={16} />
                  Reject
                </button>
                <button
                  type="button"
                  disabled={approving}
                  onClick={async () => {
                    setApproving(true);
                    try {
                      await updateDocument(doc.id, { status: "reviewed" });
                      toast.success("Document approved");
                      loadDocument();
                    } catch {
                      toast.error("Failed to approve");
                    } finally {
                      setApproving(false);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors disabled:opacity-50"
                >
                  <Check size={16} />
                  {approving ? "Approving..." : "Approve"}
                </button>
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

      {/* Signature modal */}
      <SignatureModal
        documentId={doc.id}
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSuccess={() => {
          setSignatureStatusKey((k) => k + 1);
          setActiveTab("signatures");
          loadDocument();
        }}
      />
    </div>
  );
}
