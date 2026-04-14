"use client";

import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getFileUrl(s3Key: string) {
  return `${API_URL}/api/files/${s3Key}`;
}

export default function DocumentPreview({
  s3Key,
  mimeType,
  alt,
}: {
  s3Key: string;
  mimeType: string;
  alt: string;
}) {
  if (mimeType.startsWith("image/")) {
    return (
      <img src={getFileUrl(s3Key)} alt={alt} className="w-full h-full object-cover object-top" />
    );
  }

  if (mimeType === "application/pdf") {
    return <PdfPreview s3Key={s3Key} />;
  }

  return null;
}

function PdfFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <FileText size={32} className="text-muted-foreground/40" />
    </div>
  );
}

function PdfPreview({ s3Key }: { s3Key: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();

      const response = await fetch(getFileUrl(s3Key));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("pdf") && !contentType.includes("octet-stream")) {
        throw new Error(`Not a PDF (content-type: ${contentType})`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      if (cancelled || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Render at 1.5x scale for crisp thumbnails
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
      if (!cancelled) setLoaded(true);
    }

    setFailed(false);
    setLoaded(false);
    render().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
    };
  }, [s3Key]);

  if (failed) return <PdfFallback />;

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full object-cover object-top transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
      style={{ objectFit: "cover", objectPosition: "top" }}
    />
  );
}
