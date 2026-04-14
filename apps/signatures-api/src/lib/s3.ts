import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.SIGNATURES_S3_BUCKET;
const region = process.env.AWS_REGION ?? "us-east-1";
const s3 = bucket ? new S3Client({ region }) : null;

export async function uploadFile(key: string, body: Buffer, contentType: string): Promise<string> {
  if (!s3 || !bucket) throw new Error("SIGNATURES_S3_BUCKET is not configured");

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

export async function getPresignedUrl(key: string, expiresIn = 300): Promise<string | null> {
  if (!s3 || !bucket) return null;
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, command, { expiresIn });
}

export async function getFileBuffer(
  key: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!s3 || !bucket) return null;
  const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const bytes = await response.Body?.transformToByteArray();
  if (!bytes) return null;
  return {
    buffer: Buffer.from(bytes),
    contentType: response.ContentType ?? "application/octet-stream",
  };
}
