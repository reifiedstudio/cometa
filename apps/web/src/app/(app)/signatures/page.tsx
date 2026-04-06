"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchDocuments } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { TypeBadge } from "@/components/ui/type-badge";
import SearchModal from "@/components/search-modal";
import UploadModal from "@/components/upload-modal";
import {
  CheckCircle2,
  Clock,
  FileText,
  PenLine,
  Upload,
  Users,
} from "lucide-react";

interface SignatureDoc {
  id: string;
  description: string;
  type: string;
  status: string;
  date: string;
  thumbnailUrl?: string;
}

export default function SignaturesPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<SignatureDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "awaiting" | "completed">("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Fetch all documents — we'll filter for ones with signature requests
        const data = await fetchDocuments();
        const allDocs = (data.documents ?? data ?? []) as any[];
        // Show docs that are awaiting signature or have been through signing
        const signatureDocs = allDocs
          .filter((d: any) => d.status === "awaiting_signature")
          .map((d: any) => ({
            id: d.id,
            description: d.description ?? d.originalName ?? d.id,
            type: d.type ?? "unknown",
            status: d.status,
            date: d.createdAt ?? d.date,
            thumbnailUrl: d.thumbnailUrl,
          }));
        setDocuments(signatureDocs);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredDocs = documents.filter((d) => {
    if (filter === "awaiting") return d.status === "awaiting_signature";
    if (filter === "completed") return d.status === "reviewed";
    return true;
  });

  const filterTabs = [
    { key: "all", label: "All", count: documents.length, icon: <Users size={14} /> },
    {
      key: "awaiting",
      label: "Awaiting",
      count: documents.filter((d) => d.status === "awaiting_signature").length,
      icon: <Clock size={14} />,
    },
    {
      key: "completed",
      label: "Completed",
      count: documents.filter((d) => d.status === "reviewed").length,
      icon: <CheckCircle2 size={14} />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Signatures" icon={<PenLine size={20} />}>
        <SearchInput onClick={() => setIsSearchOpen(true)} />
        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#212327] rounded-lg hover:bg-[#212327]/90 transition-colors"
        >
          <Upload size={14} />
          Upload
        </button>
      </PageHeader>

      <div className="px-6 py-4 border-b border-[#EBEEF1]">
        <FilterTabs
          tabs={filterTabs}
          activeKey={filter}
          onChange={(key) => setFilter(key as "all" | "awaiting" | "completed")}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <LoadingSpinner />
        ) : filteredDocs.length === 0 ? (
          <EmptyState
            icon={<PenLine size={48} strokeWidth={1} />}
            message="No signature requests yet"
            hint='Open a document and click "Send for Signature" to get started'
          />
        ) : (
          <div className="divide-y divide-[#EBEEF1]">
            {filteredDocs.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => router.push(`/documents/${doc.id}`)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors text-left"
              >
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0 overflow-hidden">
                  {doc.thumbnailUrl ? (
                    <img src={doc.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FileText size={20} className="text-[#717983]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#212327] truncate">
                    {doc.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <TypeBadge type={doc.type} />
                    {doc.date && (
                      <span className="text-xs text-[#717983]">
                        {"\u00B7 "}
                        {new Date(doc.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <StatusBadge status={doc.status} />
              </button>
            ))}
          </div>
        )}
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}
