import sharp from "sharp";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export async function generateThumbnail(
  buffer: Buffer,
  mimeType: string,
): Promise<Buffer | null> {
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
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
  }).promise;

  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.5 });

  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext("2d");

  await page.render({ canvasContext: ctx as any, viewport }).promise;

  // Convert canvas PNG to JPEG thumbnail via sharp
  const pngBuffer = canvas.toBuffer("image/png");
  return await sharp(pngBuffer)
    .resize(400, 560, { fit: "cover", position: "top" })
    .jpeg({ quality: 80 })
    .toBuffer();
}
