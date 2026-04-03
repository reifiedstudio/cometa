import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const bucket = process.env.S3_BUCKET;
const region = process.env.AWS_REGION ?? "eu-west-1";

const s3 = bucket
  ? new S3Client({ region })
  : null;

const LOCAL_UPLOAD_DIR = join(process.cwd(), "uploads");

function ensureLocalDir() {
  if (!existsSync(LOCAL_UPLOAD_DIR)) {
    mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
  }
}

export async function uploadFile(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
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
