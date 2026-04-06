"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { documents as mockDocuments, type Document } from "@/lib/mock-data";
import { searchDocuments } from "@/lib/api";
import {
  typePluralLabels,
  typeLabels,
  typeBadgeColors,
} from "@/lib/document-labels";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { TypeBadge } from "@/components/ui/type-badge";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function mapApiDocToSearchResult(apiDoc: any): Document {
  const flags: Document["flags"] = [];
  if (apiDoc.isVerified) flags.push("verified");
  if (apiDoc.isDuplicate) flags.push("duplicate");
  if (Array.isArray(apiDoc.flags)) {
    for (const f of apiDoc.flags) {
      if (f === "verified" || f === "duplicate") {
        if (!flags.includes(f)) flags.push(f);
      }
    }
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

  const performSearch = useCallback(
    async (q: string, type: string) => {
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
        // Fallback to local filtering of mock data
        const filtered = mockDocuments.filter((doc) => {
          const matchesType = type === "all" || doc.type === type;
          const matchesQuery =
            doc.description.toLowerCase().includes(q.toLowerCase());
          return matchesType && matchesQuery;
        });
        setResults(filtered);
      } finally {
        setSearching(false);
      }
    },
    []
  );

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
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[70vh]">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EBEEF1]">
          <div className="text-[#717983]">
            <Search size={20} />
          </div>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, invoices, contracts..."
            className="flex-1 text-base text-[#212327] placeholder:text-[#717983] focus:outline-none bg-transparent"
          />
          <kbd
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-[#717983] bg-[#F8F8F8] border border-[#EBEEF1] rounded cursor-pointer hover:bg-[#EBEEF1] transition-colors"
          >
            ESC
          </kbd>
        </div>

        {/* Filter tabs */}
        <div className="px-5 py-3 border-b border-[#EBEEF1]">
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
              <p className="text-sm text-[#717983]">Searching...</p>
            </div>
          ) : !query.trim() ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-[#717983]">Type to search documents</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-[#717983]">No results found</p>
            </div>
          ) : (
            <div>
              {filtered.map((doc, i) => (
                <button
                  key={doc.id}
                  type="button"
                  className={`w-full flex items-center justify-between px-5 py-3 hover:bg-[#F8F8F8] transition-colors text-left ${
                    i < filtered.length - 1
                      ? "border-b border-[#EBEEF1]"
                      : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#212327] truncate">
                      {doc.description}
                    </p>
                    <p className="text-xs text-[#717983] mt-0.5">{doc.date}</p>
                  </div>
                  <div className="flex items-center gap-2.5 ml-4 shrink-0">
                    <TypeBadge type={doc.type} />
                    <span className="text-[#717983]">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#EBEEF1]">
          <span className="text-sm text-[#717983]">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
          </span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFFBEB] text-[#D09305] border border-[#FDE68A]">
              <Sparkles size={14} stroke="#D09305" />
              AI-powered search
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors"
            >
              Search
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
