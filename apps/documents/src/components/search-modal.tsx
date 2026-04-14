"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { TypeBadge } from "@/components/ui/type-badge";
import { searchDocuments } from "@/lib/api";
import { typePluralLabels } from "@/lib/document-labels";
import type { Document } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function mapApiDocToSearchResult(apiDoc: any): Document {
  const flags: Document["flags"] = Array.isArray(apiDoc.flags) ? apiDoc.flags : [];
  if (apiDoc.isVerified && !flags.some((f) => f.message === "Verified")) {
    flags.push({ type: "success", message: "Verified" });
  }
  if (apiDoc.isDuplicate && !flags.some((f) => f.message === "Duplicate")) {
    flags.push({ type: "warning", message: "Duplicate" });
  }
  return {
    id: apiDoc.id,
    type: apiDoc.type ?? "invoice",
    status: apiDoc.status ?? "pending",
    flags,
    description: apiDoc.description ?? apiDoc.originalName ?? "Untitled",
    date: apiDoc.receivedAt
      ? new Date(apiDoc.receivedAt).toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    approved: apiDoc.status === "reviewed" || apiDoc.isVerified === true,
    extractedData: apiDoc.extractedData ?? undefined,
    aiSummary: apiDoc.aiSummary ?? undefined,
    s3Url: apiDoc.s3Url,
  };
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [results, setResults] = useState<Document[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(async (q: string, type: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const data = await searchDocuments(q, type);
      const mapped = (data.documents ?? []).map(mapApiDocToSearchResult);
      setResults(mapped);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query, activeFilter);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, activeFilter, isOpen, performSearch]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setActiveFilter("all");
      setResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filterTabs = Object.entries(typePluralLabels).map(([key, label]) => ({
    key,
    label,
  }));

  const filtered = results;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl flex flex-col max-h-[70vh]">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="text-muted-foreground">
            <Search size={20} />
          </div>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, invoices, contracts..."
            className="flex-1 text-base text-foreground placeholder:text-muted-foreground focus:outline-none bg-transparent"
          />
          <kbd
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-muted-foreground bg-muted border border-border rounded cursor-pointer hover:bg-border transition-colors"
          >
            ESC
          </kbd>
        </div>

        {/* Filter tabs */}
        <div className="px-5 py-3 border-b border-border">
          <FilterTabs
            tabs={filterTabs}
            activeKey={activeFilter}
            onChange={setActiveFilter}
            className="gap-1.5"
          />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {searching ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          ) : !query.trim() ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Type to search documents</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">No results found</p>
            </div>
          ) : (
            <div>
              {filtered.map((doc, i) => (
                <button
                  key={doc.id}
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between px-5 py-3 hover:bg-muted transition-colors text-left",
                    i < filtered.length - 1 && "border-b border-border",
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{doc.date}</p>
                  </div>
                  <div className="flex items-center gap-2.5 ml-4 shrink-0">
                    <TypeBadge type={doc.type} />
                    <span className="text-muted-foreground">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <span className="text-sm text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
          </span>
          <div className="flex items-center gap-3">
            <Badge className="bg-[#FFFBEB] text-[#D09305] border border-[#FDE68A]">
              <Sparkles size={14} stroke="#D09305" />
              AI-powered search
            </Badge>
            <Button variant="default" size="default">
              Search
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
