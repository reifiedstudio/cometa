"use client";

import DocumentDetail from "@/components/document-detail";
import { IntakeLayout } from "@/components/intake-layout";
import { usePathname } from "next/navigation";

export default function DocumentPage() {
  const pathname = usePathname();
  const documentId = pathname?.split("/documents/")[1]?.replace(/\/$/, "") ?? "";

  return (
    <IntakeLayout active="documents">
      {documentId && documentId !== "_" ? (
        <DocumentDetail documentId={documentId} />
      ) : null}
    </IntakeLayout>
  );
}
