"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Page } from "@/components/ui/page";
import { fetchDocumentType } from "@/lib/api";
import { cn } from "@/lib/utils";
import { FileText, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface FieldDef {
  key: string;
  label: string;
  type: string;
  columns?: { key: string; label: string }[];
}

interface DocType {
  id: string;
  slug: string;
  name: string;
  pluralName: string;
  badgeColor: string;
  description: string | null;
  fields: FieldDef[];
}

const fieldTypeLabels: Record<string, string> = {
  text: "Text",
  number: "Number",
  date: "Date",
  currency: "Currency",
  list: "List",
  table: "Table",
};

export default function ViewDocumentTypePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [docType, setDocType] = useState<DocType | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchDocumentType(id);
      setDocType(data);
    } catch {
      toast.error("Failed to load document type");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <LoadingSpinner className="flex-1" />;
  }

  if (!docType) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <EmptyState
          icon={<FileText size={48} strokeWidth={1} />}
          message="Document type not found"
        />
        <button
          type="button"
          onClick={() => router.push("/settings/types")}
          className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
        >
          Back to settings
        </button>
      </div>
    );
  }

  return (
    <Page>
      <Page.Header
        backHref="/settings/types"
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Document Types", href: "/settings/types" },
          { label: docType.name },
        ]}
      >
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock size={12} />
          Read-only
        </span>
      </Page.Header>

      <Page.Body width="centered">
        <div className="mb-8 flex items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
              docType.badgeColor,
            )}
          >
            {docType.slug}
          </span>
          <h2 className="text-xl font-semibold text-foreground">{docType.name}</h2>
        </div>

        <section className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-2">Classifier prompt</h3>
          <p className="text-xs text-muted-foreground mb-2">
            This description is fed to the AI classifier to distinguish this type from others.
          </p>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {docType.description ?? (
                <span className="italic text-muted-foreground">No description set</span>
              )}
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Extracted fields ({docType.fields.length})
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            The structured data the AI extracts from documents of this type.
          </p>
          <div className="rounded-lg border bg-card overflow-hidden">
            {docType.fields.map((f, i) => (
              <div
                key={f.key}
                className={cn("flex items-start justify-between px-4 py-3", i !== 0 && "border-t")}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{f.key}</p>
                  {f.type === "table" && f.columns && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Columns: {f.columns.map((c) => c.label).join(", ")}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                  {fieldTypeLabels[f.type] ?? f.type}
                </span>
              </div>
            ))}
          </div>
        </section>
      </Page.Body>
    </Page>
  );
}
