import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface StorageConfig {
  /** S3 bucket name. Falls back to S3_BUCKET env var. */
  bucket?: string;
  /** Key prefix prepended to every operation (e.g. "intake/"). Falls back to S3_PREFIX env var. */
  prefix?: string;
  /** AWS region. Falls back to AWS_REGION env var. */
  region?: string;
}

export interface Storage {
  /** Upload a file. Returns the full S3 URL. */
  upload(key: string, body: Buffer, contentType: string): Promise<string>;

  /** Get a time-limited signed URL for direct browser access. */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;

  /** Read a file into memory. */
  getBuffer(key: string): Promise<{ buffer: Buffer; contentType: string } | null>;

  /** Delete a file. */
  delete(key: string): Promise<void>;

  /** Get the full prefixed key (useful for storing in DB). */
  fullKey(key: string): string;

  /** The bucket name. */
  readonly bucket: string;

  /** The prefix. */
  readonly prefix: string;
}

/**
 * Create a storage client with explicit config.
 * Use this when you need a non-default bucket/prefix (e.g. notes).
 *
 * ```ts
 * const notesStorage = createStorage({ prefix: "notes/" });
 * ```
 */
export function createStorage(config: StorageConfig = {}): Storage {
  const bucket = config.bucket ?? process.env.S3_BUCKET ?? "";
  const prefix = config.prefix ?? process.env.S3_PREFIX ?? "";
  const region = config.region ?? process.env.AWS_REGION ?? "us-east-1";

  if (!bucket) {
    throw new Error("@cometa/storage: S3_BUCKET is not configured");
  }

  const s3 = new S3Client({ region });

  function resolve(key: string): string {
    // Don't double-prefix if key already starts with the prefix
    return key.startsWith(prefix) ? key : `${prefix}${key}`;
  }

  return {
    bucket,
    prefix,

    fullKey(key: string): string {
      return resolve(key);
    },

    async upload(key: string, body: Buffer, contentType: string): Promise<string> {
      const fullKey = resolve(key);
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: fullKey,
          Body: body,
          ContentType: contentType,
        }),
      );
      return `https://${bucket}.s3.${region}.amazonaws.com/${fullKey}`;
    },

    async getSignedUrl(key: string, expiresIn = 300): Promise<string> {
      const fullKey = resolve(key);
      const command = new GetObjectCommand({ Bucket: bucket, Key: fullKey });
      return getSignedUrl(s3, command, { expiresIn });
    },

    async getBuffer(
      key: string,
    ): Promise<{ buffer: Buffer; contentType: string } | null> {
      const fullKey = resolve(key);
      try {
        const response = await s3.send(
          new GetObjectCommand({ Bucket: bucket, Key: fullKey }),
        );
        const bytes = await response.Body?.transformToByteArray();
        if (!bytes) return null;
        return {
          buffer: Buffer.from(bytes),
          contentType: response.ContentType ?? "application/octet-stream",
        };
      } catch (err: any) {
        if (err?.name === "NoSuchKey") return null;
        throw err;
      }
    },

    async delete(key: string): Promise<void> {
      const fullKey = resolve(key);
      await s3.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: fullKey }),
      );
    },
  };
}

/**
 * Default storage instance — reads S3_BUCKET + S3_PREFIX from env.
 * Import this for the common case.
 *
 * ```ts
 * import { storage } from "@cometa/storage";
 * await storage.upload("documents/file.pdf", buffer, "application/pdf");
 * const url = await storage.getSignedUrl("documents/file.pdf");
 * ```
 */
export const storage: Storage = new Proxy({} as Storage, {
  get(_target, prop) {
    // Lazy init — don't create the client until first use
    // (avoids crash if env vars aren't set at import time)
    const instance = createStorage();
    Object.assign(_target, instance);
    return (instance as any)[prop];
  },
});
