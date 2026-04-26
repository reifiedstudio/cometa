"use client";

import { IntakeLayout } from "@/components/intake-layout";
import { AppPage } from "@cometa/ui/app-page";
import { CollectionProvider, CollectionView, CollectionItem, ViewToggle } from "@cometa/ui/collection-view";
import { Badge } from "@cometa/ui/ui/badge";
import { Button } from "@cometa/ui/ui/button";
import { fetchDocuments } from "@/lib/api";
import { typeLabels, typeBadgeColors, statusLabels, statusBadgeColors } from "@/lib/document-labels";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-recent"],
    queryFn: async () => {
      const allData = await fetchDocuments();
      return allData.documents ?? [];
    },
    refetchInterval: 60_000,
  });

  const recentDocs = (data ?? []).slice(0, 12);

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <IntakeLayout active="home">
      <CollectionProvider>
        <AppPage
          breadcrumbs={[{ label: "Intake" }, { label: "Home" }]}
          title={greeting}
          actions={
            <>
              <ViewToggle />
              <Button variant="outline" size="sm" onClick={() => router.push("/documents")}>
                View all
              </Button>
            </>
          }
        >
          {isLoading ? null : !recentDocs.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <FileText className="size-8 mb-3 opacity-40" />
              <p className="text-sm">No documents yet</p>
            </div>
          ) : (
            <CollectionView>
              {recentDocs.map((doc: any) => (
                <CollectionItem
                  key={doc.id}
                  title={doc.description ?? doc.originalName ?? "Untitled"}
                  timestamp={doc.receivedAt ?? doc.createdAt}
                  href={`/documents/${doc.id}`}
                  badge={
                    <Badge className={`border text-[11px] ${typeBadgeColors[doc.type] ?? "bg-muted text-muted-foreground"}`}>
                      {typeLabels[doc.type] ?? doc.type}
                    </Badge>
                  }
                  footer={
                    <Badge variant="secondary" className={`text-xs ${statusBadgeColors[doc.status] ?? ""}`}>
                      {statusLabels[doc.status] ?? doc.status}
                    </Badge>
                  }
                />
              ))}
            </CollectionView>
          )}
        </AppPage>
      </CollectionProvider>
    </IntakeLayout>
  );
}
