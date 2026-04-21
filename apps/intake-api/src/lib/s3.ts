// Re-export from shared storage package
import { storage } from "@cometa/storage";

export const uploadFile = storage.upload.bind(storage);
export const getPresignedUrl = storage.getSignedUrl.bind(storage);
export const getFileBuffer = storage.getBuffer.bind(storage);
export const deleteFile = storage.delete.bind(storage);

export function getS3BucketAndKey(s3Url: string): { bucket: string; key: string } | null {
  const match = s3Url.match(/https:\/\/(.+?)\.s3\..+?\.amazonaws\.com\/(.+)/);
  if (!match) return null;
  return { bucket: match[1], key: match[2] };
}
