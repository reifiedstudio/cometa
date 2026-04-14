import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.S3_BUCKET;
const region = process.env.AWS_REGION ?? "us-east-1";

const s3 = bucket ? new S3Client({ region }) : null;

const LOCAL_UPLOAD_DIR = join(process.cwd(), "uploads");

function ensureLocalDir() {
  if (!existsSync(LOCAL_UPLOAD_DIR)) {
    mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
  }
}

export async function uploadFile(key: string, body: Buffer, contentType: string): Promise<string> {
  if (s3 && bucket) {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  // Local fallback for development
  ensureLocalDir();
  const filePath = join(LOCAL_UPLOAD_DIR, key);
  const dir = join(LOCAL_UPLOAD_DIR, key.split("/").slice(0, -1).join("/"));
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, body);
  return `file://${filePath}`;
}

export function getS3BucketAndKey(s3Url: string): { bucket: string; key: string } | null {
  if (!bucket) return null;
  const match = s3Url.match(/https:\/\/(.+?)\.s3\..+?\.amazonaws\.com\/(.+)/);
  if (!match) return null;
  return { bucket: match[1], key: match[2] };
}

export async function getPresignedUrl(key: string, expiresIn = 300): Promise<string | null> {
  if (!s3 || !bucket) return null;
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, command, { expiresIn });
}

export async function getFileBuffer(
  key: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (s3 && bucket) {
    const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const bytes = await response.Body?.transformToByteArray();
    if (!bytes) return null;
    return {
      buffer: Buffer.from(bytes),
      contentType: response.ContentType ?? "application/octet-stream",
    };
  }

  // Local fallback
  const filePath = join(LOCAL_UPLOAD_DIR, key);
  if (!existsSync(filePath)) return null;
  return { buffer: readFileSync(filePath), contentType: "application/octet-stream" };
}
