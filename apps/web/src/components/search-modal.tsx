"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { documents as mockDocuments, type Document } from "@/lib/mock-data";
import { searchDocuments } from "@/lib/api";

const typeLabels: Record<string, string> = {
  all: "All",
  invoice: "Invoices",
  receipt: "Receipts",
  contract: "Contracts",
  delivery_note: "Delivery Notes",
};

const typeBadgeColors: Record<Document["type"], string> = {
  invoice: "bg-orange-100 text-orange-700",
  receipt: "bg-emerald-100 text-emerald-700",
  contract: "bg-blue-100 text-blue-700",
  delivery_note: "bg-red-100 text-red-700",
  bill: "bg-sky-100 text-sky-700",
};

const typeDisplayLabels: Record<Document["type"], string> = {
  invoice: "Invoice",
  receipt: "Receipt",
  contract: "Contract",
  delivery_note: "Delivery Note",
  bill: "Bill",
};

function SearchIcon() {
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
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ArrowRightIcon() {
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
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="14"
      height="14"
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

  const filterKeys = Object.keys(typeLabels);

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
            <SearchIcon />
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
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-[#EBEEF1]">
          {filterKeys.map((key) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? "bg-[#212327] text-white"
                    : "bg-[#F8F8F8] text-[#555A65] hover:bg-[#EBEEF1]"
                }`}
              >
                {typeLabels[key]}
              </button>
            );
          })}
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
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${typeBadgeColors[doc.type]}`}
                    >
                      {typeDisplayLabels[doc.type]}
                    </span>
                    <span className="text-[#717983]">
                      <ArrowRightIcon />
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
              <SparkleIcon />
              AI-powered search
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors"
            >
              Search
              <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
