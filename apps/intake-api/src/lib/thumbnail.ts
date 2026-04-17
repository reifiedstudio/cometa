import sharp from "sharp";

export async function generateThumbnail(buffer: Buffer, mimeType: string): Promise<Buffer | null> {
  try {
    if (mimeType === "application/pdf") {
      return await pdfToThumbnail(buffer);
    }

    if (mimeType.startsWith("image/")) {
      return await sharp(buffer)
        .resize(400, 560, { fit: "cover", position: "top" })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    return null;
  } catch (err) {
    console.error("[thumbnail] Failed to generate thumbnail:", err);
    return null;
  }
}

async function pdfToThumbnail(buffer: Buffer): Promise<Buffer> {
  // Use sharp to render the first page of the PDF
  // sharp uses libvips which supports PDF rendering via poppler
  return await sharp(buffer, { density: 150, pages: 1 })
    .resize(400, 560, { fit: "cover", position: "top" })
    .jpeg({ quality: 80 })
    .toBuffer();
}
