"use client";

import DocumentDetail from "@/components/document-detail";
import { IntakeLayout } from "@/components/intake-layout";
import { AppPage } from "@cometa/ui/app-page";
import { usePathname } from "next/navigation";

export default function DocumentPage() {
  const pathname = usePathname();
  const documentId = pathname?.split("/documents/")[1]?.replace(/\/$/, "") ?? "";

  return (
    <IntakeLayout active="documents">
      <AppPage
        breadcrumbs={[{ label: "Intake" }, { label: "Documents", href: "/documents" }, { label: documentId.slice(0, 8) }]}
        noPadding
      >
        {documentId && documentId !== "_" ? (
          <DocumentDetail documentId={documentId} />
        ) : null}
      </AppPage>
    </IntakeLayout>
  );
}
