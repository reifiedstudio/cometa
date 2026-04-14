"use client";

import DocumentDetail from "@/components/document-detail";
import { useParams } from "next/navigation";

export default function DocumentPage() {
  const params = useParams();
  return <DocumentDetail documentId={params.id as string} />;
}
