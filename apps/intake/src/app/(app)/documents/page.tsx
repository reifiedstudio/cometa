"use client";

import DocumentsPage from "@/components/documents-page";
import { IntakeLayout } from "@/components/intake-layout";

export default function Documents() {
  return (
    <IntakeLayout active="documents">
      <DocumentsPage />
    </IntakeLayout>
  );
}
