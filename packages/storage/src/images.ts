import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

export interface ImageOptions {
  /** Target width in pixels. */
  w?: number;
  /** Target height in pixels (optional, preserves aspect ratio if omitted). */
  h?: number;
  /** JPEG quality 1-100 (default 80). */
  q?: number;
}

export interface ImageServiceConfig {
  /** CloudFront domain (e.g. "images.daniellourie.me"). Falls back to IMAGES_DOMAIN env. */
  domain?: string;
  /** CloudFront key pair ID. Falls back to IMAGES_KEYPAIR_ID env. */
  keypairId?: string;
  /** CloudFront private key PEM string. Falls back to IMAGES_PRIVATE_KEY env. */
  privateKey?: string;
  /** URL expiry in seconds. Defaults to 3600 (1 hour). */
  expiresIn?: number;
}

export interface ImageService {
  /**
   * Generate a signed CloudFront URL for an image.
   *
   * ```ts
   * const url = images.url("intake/documents/photo.png", { w: 800 });
   * // → "https://images.daniellourie.me/intake/documents/photo.png?w=800&Signature=...&Expires=..."
   * ```
   */
  url(key: string, options?: ImageOptions): string;
}

/**
 * Create an image service client that generates signed CloudFront URLs.
 *
 * ```ts
 * const images = createImageService();
 * const previewUrl = images.url("intake/documents/photo.png", { w: 800 });
 * ```
 *
 * Config is read from env vars if not passed:
 * - IMAGES_DOMAIN
 * - IMAGES_KEYPAIR_ID
 * - IMAGES_PRIVATE_KEY
 */
export function createImageService(config: ImageServiceConfig = {}): ImageService {
  const domain = config.domain ?? process.env.IMAGES_DOMAIN;
  const keypairId = config.keypairId ?? process.env.IMAGES_KEYPAIR_ID;
  const privateKey = config.privateKey ?? process.env.IMAGES_PRIVATE_KEY;

  if (!domain || !keypairId || !privateKey) {
    throw new Error(
      "@cometa/storage: Image service requires IMAGES_DOMAIN, IMAGES_KEYPAIR_ID, and IMAGES_PRIVATE_KEY",
    );
  }

  const expiresIn = config.expiresIn ?? 3600;

  return {
    url(key: string, options?: ImageOptions): string {
      // Build the base URL
      const params = new URLSearchParams();
      if (options?.w) params.set("w", String(options.w));
      if (options?.h) params.set("h", String(options.h));
      if (options?.q) params.set("q", String(options.q));

      const qs = params.toString();
      const encodedKey = key.split("/").map(encodeURIComponent).join("/");
      const baseUrl = `https://${domain}/${encodedKey}${qs ? `?${qs}` : ""}`;

      // Sign with CloudFront key pair
      const expires = new Date(Date.now() + expiresIn * 1000);

      return getSignedUrl({
        url: baseUrl,
        keyPairId: keypairId,
        privateKey,
        dateLessThan: expires.toISOString(),
      });
    },
  };
}
