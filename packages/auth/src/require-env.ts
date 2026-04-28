/**
 * Fail-fast env var validation.
 *
 * Imported at module-load time by services that depend on shared secrets.
 * In production this throws on cold start so a misconfigured Lambda fails
 * to initialise (visible in CloudWatch immediately on deploy) rather than
 * returning cryptic 401s at request time.
 */

export function requireEnv(...names: string[]): void {
  if (process.env.NODE_ENV !== "production") return;
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required env var(s): ${missing.join(", ")}. ` +
        `Check the Lambda's Terraform module env block (likely needs to merge a secrets local).`,
    );
  }
}

/** Run the check on import. Caller decides which vars to require by passing them. */
export function requireClerkAuth(): void {
  requireEnv("CLERK_SECRET_KEY");
}
