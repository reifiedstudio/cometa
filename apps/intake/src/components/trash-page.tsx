"use client";

import DateRangePicker from "@/components/date-range-picker";
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
import { SearchInput } from "@/components/ui/search-input";
import { AppPage } from "@cometa/ui/app-page";
import { CollectionProvider, CollectionView, CollectionItem, ViewToggle } from "@cometa/ui/collection-view";
import { Badge } from "@cometa/ui/ui/badge";
import { deleteDocument, fetchTrashedDocuments, restoreDocument } from "@/lib/api";
import { typeLabels, typePluralLabels, typeBadgeColors } from "@/lib/document-labels";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TrashPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["trash"],
    queryFn: async () => {
      const data = await fetchTrashedDocuments();
      const docs = (data.documents ?? []).map((d: any) => ({
        id: d.id,
        description: d.description,
        originalName: d.originalName,
        type: d.type ?? "invoice",
        status: d.status,
        updatedAt: d.updatedAt,
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
    activeFilter === "all" ? documents : documents.filter((d: any) => d.type === activeFilter);

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
    <CollectionProvider>
    <AppPage
      breadcrumbs={[{ label: "Intake" }, { label: "Trash" }]}
      title="Trash"
      description={`${counts.all ?? 0} items`}
      actions={
        <>
          <ViewToggle />
          <SearchInput onClick={() => setIsSearchOpen(true)} />
        </>
      }
      noPadding
    >
      <div className="flex items-center justify-between px-6 py-3 border-b shrink-0">
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

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading ? null : !filteredDocs.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Trash2 className="size-8 mb-3 opacity-40" />
            <p className="text-sm">Trash is empty</p>
          </div>
        ) : (
          <CollectionView pageSize={12}>
            {filteredDocs.map((doc: any) => (
              <CollectionItem
                key={doc.id}
                title={doc.description ?? doc.originalName ?? "Untitled"}
                timestamp={doc.updatedAt}
                badge={
                  <Badge className={`border text-[11px] ${typeBadgeColors[doc.type] ?? "bg-muted text-muted-foreground"}`}>
                    {typeLabels[doc.type] ?? doc.type}
                  </Badge>
                }
                actions={
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRestore(doc.id); }}
                    >
                      <RotateCcw className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteId(doc.id); }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                }
              />
            ))}
          </CollectionView>
        )}
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

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
    </AppPage>
    </CollectionProvider>
  );
}
