"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchTrashedDocuments, restoreDocument, deleteDocument } from "@/lib/api";
import { toast } from "sonner";
import DocumentList, { type DocumentListItem } from "@/components/document-list";
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

export default function TrashPage() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTrashedDocuments();
      setDocuments(
        (data.documents ?? []).map((d: any) => ({
          id: d.id,
          description: d.description,
          originalName: d.originalName,
          type: d.type ?? "invoice",
          status: d.status,
          date: d.updatedAt
            ? new Date(d.updatedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })
            : "",
          thumbnailUrl: d.thumbnailUrl,
        }))
      );
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleRestore = async (id: string) => {
    try {
      await restoreDocument(id);
      toast.success("Document restored");
      loadDocuments();
    } catch {
      toast.error("Failed to restore document");
    }
  };

  const handlePermanentDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDocument(deleteId);
      toast.success("Document permanently deleted");
      setDeleteId(null);
      loadDocuments();
    } catch {
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <h1 className="text-xl font-bold text-[#212327]">Trash</h1>
        <p className="text-sm text-[#717983] mt-1">
          Rejected documents are automatically deleted after 90 days.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-2">
        <DocumentList
          documents={documents}
          loading={loading}
          emptyMessage="Trash is empty"
          actions={(doc) => (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleRestore(doc.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#555A65] bg-white border border-[#EBEEF1] rounded-md hover:bg-[#F8F8F8] transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Restore
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(doc.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-red-600 bg-white border border-[#EBEEF1] rounded-md hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        />
      </div>

      {/* Permanent delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This document and its files will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
