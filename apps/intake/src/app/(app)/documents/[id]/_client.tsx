"use client";

import DocumentDetail from "@/components/document-detail";
import { IntakeLayout } from "@/components/intake-layout";
import { useParams } from "next/navigation";

export default function DocumentPage() {
  const params = useParams();
  return (
    <IntakeLayout
      breadcrumbs={[
        { label: "Intake" },
        { label: "Documents", href: "/documents" },
        { label: "Detail" },
      ]}
      active="documents"
    >
      <DocumentDetail documentId={params.id as string} />
    </IntakeLayout>
  );
}
