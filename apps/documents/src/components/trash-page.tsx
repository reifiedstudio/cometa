"use client";

import DateRangePicker from "@/components/date-range-picker";
import DocumentList, { type DocumentListItem } from "@/components/document-list";
import SearchModal from "@/components/search-modal";
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
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import UploadModal from "@/components/upload-modal";
import { deleteDocument, fetchTrashedDocuments, restoreDocument } from "@/lib/api";
import { typePluralLabels } from "@/lib/document-labels";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TrashPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["trash"],
    queryFn: async () => {
      const data = await fetchTrashedDocuments();
      const docs: DocumentListItem[] = (data.documents ?? []).map((d: any) => ({
        id: d.id,
        description: d.description,
        originalName: d.originalName,
        type: d.type ?? "invoice",
        status: d.status,
        date: d.updatedAt
          ? new Date(d.updatedAt).toLocaleDateString("en-ZA", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        thumbnailUrl: d.thumbnailUrl,
        signatureProgress: d.signatureProgress ?? null,
      }));

      const counts: Record<string, number> = { all: docs.length };
      for (const d of docs) {
        counts[d.type] = (counts[d.type] ?? 0) + 1;
      }

      return { documents: docs, counts };
    },
    refetchInterval: 60_000,
  });

  const documents = data?.documents ?? [];
  const counts = data?.counts ?? { all: 0 };

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

  const filteredDocs =
    activeFilter === "all" ? documents : documents.filter((d) => d.type === activeFilter);

  const filterKeys = Object.keys(counts);
  const tabs = filterKeys.map((key) => ({
    key,
    label: typePluralLabels[key] ?? key,
    count: counts[key] ?? 0,
  }));

  const handleRestore = async (id: string) => {
    try {
      await restoreDocument(id);
      toast.success("Document restored");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["documents"] });
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
      refetch();
    } catch {
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <PageHeader title="Trash">
        <SearchInput onClick={() => setIsSearchOpen(true)} />
        <Button onClick={() => setIsUploadOpen(true)}>
          <Upload size={16} />
          Upload
        </Button>
      </PageHeader>

      <div className="flex items-center justify-between px-8 py-3 border-b border-border">
        <FilterTabs tabs={tabs} activeKey={activeFilter} onChange={(key) => setActiveFilter(key)} />
        <div className="flex items-center gap-2">
          <DateRangePicker
            onChange={(range) => {
              setDateFrom(range?.from?.toISOString());
              setDateTo(range?.to?.toISOString());
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-2">
        <DocumentList
          documents={filteredDocs}
          loading={isLoading}
          emptyMessage="Trash is empty"
          onSelect={(doc) => router.push(`/documents/${doc.id}`)}
        />
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={() => refetch()}
      />

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
