"use client";

import DocumentList, { type DocumentListItem } from "@/components/document-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Page } from "@/components/ui/page";
import { fetchDocuments, fetchOverdueSignatures } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, FileText, PenLine, Settings, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

function ViewAllLink({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="xs" onClick={onClick}>
      View all
    </Button>
  );
}

function QuickLink({
  href,
  icon,
  label,
  description,
}: { href: string; icon: React.ReactNode; label: string; description: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted transition-colors text-left group w-full"
    >
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground/60 mt-0.5">{description}</p>
      </div>
      <ArrowRight
        size={14}
        className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors flex-shrink-0"
      />
    </button>
  );
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function toDocumentListItem(doc: any): DocumentListItem {
  return {
    id: doc.id,
    description: doc.description ?? doc.originalName ?? null,
    originalName: doc.originalName,
    type: doc.type ?? "unknown",
    status: doc.status,
    date: formatDate(doc.receivedAt ?? doc.createdAt),
    thumbnailUrl: doc.thumbnailUrl,
    signatureProgress: doc.signatureProgress ?? null,
  };
}

function overdueRequestToItem(req: any): DocumentListItem {
  return {
    id: req.documentId,
    description: req.documentDescription ?? req.documentOriginalName ?? null,
    originalName: req.documentOriginalName,
    type: req.documentType ?? "unknown",
    status: "overdue",
    date: "",
    thumbnailUrl: req.documentThumbnailUrl,
    signatureProgress: null,
  };
}

export default function HomePage() {
  const router = useRouter();

  const { data: dashboardData, isLoading: loading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [allData, sigData, overdueData] = await Promise.all([
        fetchDocuments(),
        fetchDocuments({ status: "awaiting_signature" }),
        fetchOverdueSignatures().catch(() => ({ requests: [] })),
      ]);

      const docs = allData.documents ?? [];
      const sigDocs = sigData.documents ?? [];
      const overdueRequests = overdueData.requests ?? [];

      return {
        recentDocs: docs.slice(0, 10).map(toDocumentListItem),
        awaitingDocs: sigDocs.slice(0, 10).map(toDocumentListItem),
        overdueSigs: overdueRequests.slice(0, 10).map((r: any) => ({
          ...overdueRequestToItem(r),
          _daysOverdue: Math.floor(
            (Date.now() - new Date(r.expiresAt).getTime()) / (1000 * 60 * 60 * 24),
          ),
        })),
      };
    },
    refetchInterval: 60_000,
  });

  const recentDocs = dashboardData?.recentDocs ?? [];
  const awaitingDocs = dashboardData?.awaitingDocs ?? [];
  const overdueSigs = dashboardData?.overdueSigs ?? [];

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <Page>
      <Page.Header title={greeting} />

      <div className="flex-1 overflow-hidden px-8 py-6 min-h-0">
        <div className="h-full flex gap-4">
          {/* Left: 3 stacked inbox panels */}
          <div className="flex-1 min-w-0 h-full flex flex-col gap-4">
            {/* Awaiting Signature */}
            <Card className="flex flex-col min-h-0 max-h-[30%] shrink-0">
              <Card.Header>
                <Card.Title>Awaiting signature</Card.Title>
                <ViewAllLink onClick={() => router.push("/signatures")} />
              </Card.Header>
              <Card.Body className="flex-1 overflow-y-auto px-2 py-1">
                <DocumentList
                  documents={awaitingDocs}
                  loading={loading}
                  emptyMessage="No documents awaiting signature"
                  groupByMonth={false}
                  onSelect={(doc) => router.push(`/documents/${doc.id}`)}
                />
              </Card.Body>
            </Card>

            {/* Overdue Signatures */}
            <Card className="flex flex-col min-h-0 max-h-[30%] shrink-0">
              <Card.Header>
                <Card.Title>Overdue signatures</Card.Title>
                <ViewAllLink onClick={() => router.push("/signatures")} />
              </Card.Header>
              <Card.Body className="flex-1 overflow-y-auto px-2 py-1">
                <DocumentList
                  documents={overdueSigs}
                  loading={loading}
                  emptyMessage="No overdue signatures"
                  groupByMonth={false}
                  onSelect={(doc) => router.push(`/documents/${doc.id}`)}
                  trailing={(doc) => (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">
                      <Clock size={9} />
                      {(doc as any)._daysOverdue}d
                    </span>
                  )}
                />
              </Card.Body>
            </Card>

            {/* Recent Documents */}
            <Card className="flex flex-col flex-1 min-h-0">
              <Card.Header>
                <Card.Title>Recent documents</Card.Title>
                <ViewAllLink onClick={() => router.push("/documents")} />
              </Card.Header>
              <Card.Body className="flex-1 overflow-y-auto px-2 py-1">
                <DocumentList
                  documents={recentDocs}
                  loading={loading}
                  emptyMessage="No documents yet"
                  groupByMonth={false}
                  onSelect={(doc) => router.push(`/documents/${doc.id}`)}
                />
              </Card.Body>
            </Card>
          </div>

          {/* Right: Quick links */}
          <div className="w-64 flex-shrink-0 space-y-3">
            <QuickLink
              href="/documents"
              icon={<FileText size={18} />}
              label="Documents"
              description="View and manage"
            />
            <QuickLink
              href="/signatures"
              icon={<PenLine size={18} />}
              label="Signatures"
              description="Manage requests"
            />
            <QuickLink
              href="/trash"
              icon={<Trash2 size={18} />}
              label="Trash"
              description="Deleted documents"
            />
            <QuickLink
              href="/settings"
              icon={<Settings size={18} />}
              label="Settings"
              description="Preferences"
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
