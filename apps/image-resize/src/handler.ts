import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import sharp from "sharp";

const s3 = new S3Client({});
const BUCKET = process.env.S3_BUCKET!;

/**
 * Image resize service.
 *
 * URL format: /<s3-key>?w=800&h=600&q=80
 *   w  = target width (required for resize)
 *   h  = target height (optional, preserves aspect ratio if omitted)
 *   q  = JPEG quality 1-100 (default 80)
 *
 * No ?w param → 302 redirect to signed URL of original.
 * With ?w → resize, cache in S3 under cache/, 302 redirect to signed cache URL.
 */
export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const uri = decodeURIComponent(event.rawPath).replace(/^\//, "");
  const params = event.queryStringParameters ?? {};

  if (!uri) {
    return { statusCode: 400, body: "No file key" };
  }

  const width = params.w ? parseInt(params.w, 10) : null;
  const height = params.h ? parseInt(params.h, 10) : null;
  const quality = params.q ? parseInt(params.q, 10) : 80;

  // No resize → signed URL to original
  if (!width) {
    const url = await sign(uri);
    return redirect(url);
  }

  // Clamp values
  const w = Math.min(Math.max(width, 1), 4000);
  const h = height ? Math.min(Math.max(height, 1), 4000) : undefined;
  const q = Math.min(Math.max(quality, 1), 100);

  const dims = h ? `${w}x${h}` : `${w}`;
  const cacheKey = `cache/${uri}_${dims}.jpg`;

  // Check cache
  if (await exists(cacheKey)) {
    return redirect(await sign(cacheKey));
  }

  // Read original
  let original: Buffer;
  try {
    const res = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: uri }),
    );
    const bytes = await res.Body?.transformToByteArray();
    if (!bytes) return { statusCode: 404, body: "Not found" };
    original = Buffer.from(bytes);
  } catch {
    return { statusCode: 404, body: "Not found" };
  }

  // Resize
  const resized = await sharp(original)
    .resize(w, h, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: q })
    .toBuffer();

  // Save to cache
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: cacheKey,
      Body: resized,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=2592000",
    }),
  );

  // Redirect to cached version
  return redirect(await sign(cacheKey));
}

async function sign(key: string): Promise<string> {
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: 3600 },
  );
}

async function exists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

function redirect(url: string): APIGatewayProxyResultV2 {
  return {
    statusCode: 302,
    headers: {
      location: url,
      "cache-control": "public, max-age=86400",
    },
    body: "",
  };
}
