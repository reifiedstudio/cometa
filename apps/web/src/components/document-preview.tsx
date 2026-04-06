"use client";

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
      <img
        src={getFileUrl(s3Key)}
        alt={alt}
        className="w-full h-full object-cover object-top"
      />
    );
  }

  if (mimeType === "application/pdf") {
    return <PdfPreview s3Key={s3Key} />;
  }

  return null;
}

function PdfPreview({ s3Key }: { s3Key: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();

      const response = await fetch(getFileUrl(s3Key));
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

    render().catch((err) => console.error("[pdf-preview]", err));

    return () => {
      cancelled = true;
    };
  }, [s3Key]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full object-cover object-top transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
      style={{ objectFit: "cover", objectPosition: "top" }}
    />
  );
}
