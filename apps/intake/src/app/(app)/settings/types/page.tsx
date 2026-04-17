"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SkeletonList } from "@/components/ui/skeleton-list";
import { fetchDocumentTypes } from "@/lib/api";
import { cn } from "@/lib/utils";
import { FileText, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface DocType {
  id: string;
  slug: string;
  name: string;
  pluralName: string;
  badgeColor: string;
  description: string | null;
  fields: any[];
  isDefault: boolean;
  isActive: boolean;
}

function TypeRow({ type, onView }: { type: DocType; onView: () => void }) {
  return (
    <div
      onClick={onView}
      className="group flex items-start gap-4 px-4 py-3 rounded-lg border border-transparent hover:border hover:bg-muted cursor-pointer transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
        <FileText size={20} className="text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
              type.badgeColor,
            )}
          >
            {type.slug}
          </span>
          <p className="text-sm font-medium text-foreground truncate">{type.name}</p>
        </div>
        {type.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{type.description}</p>
        )}
      </div>

      <span className="text-xs text-muted-foreground w-24 text-right flex-shrink-0 mt-1">
        {type.fields.length} field{type.fields.length !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

export default function DocumentTypesPage() {
  const router = useRouter();
  const [types, setTypes] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTypes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchDocumentTypes();
      setTypes((data.types ?? []).filter((t: DocType) => t.isActive));
    } catch {
      toast.error("Failed to load document types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <PageHeader title="Document Types" backHref="/settings">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock size={12} />
          Read-only
        </span>
      </PageHeader>

      <div className="flex-1 overflow-y-auto px-8 py-4">
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          The set of document types is fixed and managed in code. To add or change a type, edit{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">seed-document-types.ts</code> and
          re-deploy.
        </p>
        {loading ? (
          <SkeletonList rows={5} />
        ) : types.length === 0 ? (
          <EmptyState icon={<FileText size={48} strokeWidth={1} />} message="No document types" />
        ) : (
          <div className="space-y-1">
            {types.map((t) => (
              <TypeRow key={t.id} type={t} onView={() => router.push(`/settings/types/${t.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
