import { GetParameterCommand, GetParametersByPathCommand, SSMClient } from "@aws-sdk/client-ssm";

const ssm = new SSMClient({});

const NAME_PREFIX = process.env.NAME_PREFIX ?? "cometa-dev";
const PREFIX = `/${NAME_PREFIX}/services`;

interface CacheEntry {
  value: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function getCached(key: string): string | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

function setCache(key: string, value: string): void {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

/**
 * Look up a service's SQS queue URL from SSM Parameter Store.
 * Results are cached in memory for 60 seconds.
 */
export async function discoverService(slug: string): Promise<string> {
  const paramName = `${PREFIX}/${slug}/queue-url`;
  const cached = getCached(paramName);
  if (cached) return cached;

  const result = await ssm.send(new GetParameterCommand({ Name: paramName }));

  const queueUrl = result.Parameter?.Value;
  if (!queueUrl) {
    throw new Error(`SSM parameter not found: ${paramName}`);
  }

  setCache(paramName, queueUrl);
  return queueUrl;
}

/**
 * List all registered services and their queue URLs from SSM.
 */
export async function listServices(): Promise<{ slug: string; queueUrl: string }[]> {
  const services: { slug: string; queueUrl: string }[] = [];
  let nextToken: string | undefined;

  do {
    const result = await ssm.send(
      new GetParametersByPathCommand({
        Path: `${PREFIX}/`,
        Recursive: true,
        NextToken: nextToken,
      }),
    );

    for (const param of result.Parameters ?? []) {
      if (!param.Name || !param.Value) continue;
      // Parameter name is like /cometa-dev/services/accounting/queue-url
      const parts = param.Name.replace(`${PREFIX}/`, "").split("/");
      if (parts.length === 2 && parts[1] === "queue-url") {
        const slug = parts[0]!;
        services.push({ slug, queueUrl: param.Value });
        setCache(`${PREFIX}/${slug}/queue-url`, param.Value);
      }
    }

    nextToken = result.NextToken;
  } while (nextToken);

  return services;
}
