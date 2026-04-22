"use client";

import { FileText } from "lucide-react";

export default function DocumentPreview({
  previewUrl,
  mimeType,
  alt,
}: {
  previewUrl: string | null;
  mimeType: string;
  alt: string;
}) {
  if (!previewUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <FileText size={32} className="text-muted-foreground/40" />
      </div>
    );
  }

  if (mimeType.startsWith("image/")) {
    return (
      <img src={previewUrl} alt={alt} className="w-full h-full object-cover object-top" />
    );
  }

  // PDFs and other types — show placeholder for now
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <FileText size={32} className="text-muted-foreground/40" />
    </div>
  );
}
