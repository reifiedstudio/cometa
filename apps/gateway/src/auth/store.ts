/**
 * DynamoDB-backed OAuth store.
 * Stores registered clients, auth codes, and access tokens.
 * Uses TTL for automatic expiry.
 *
 * Key schema:
 *   PK: CLIENT#{client_id}     SK: CLIENT
 *   PK: CODE#{code}            SK: CODE
 *   PK: TOKEN#{token}          SK: TOKEN
 *   PK: PENDING#{id}           SK: PENDING
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env["AUTH_TABLE"] ?? "cometa-dev-auth";

function generateId(length = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// TTL helper — DynamoDB TTL uses epoch seconds
function ttlSeconds(ms: number): number {
  return Math.floor((Date.now() + ms) / 1000);
}

// ── Types ──

export interface OAuthClient {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
  client_name?: string;
  grant_types: string[];
  response_types: string[];
  token_endpoint_auth_method: string;
  registered_at: number;
}

export interface AuthCode {
  code: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  userId: string;
  userEmail: string;
  userRole: string;
  state?: string;
  expiresAt: number;
}

export interface AccessToken {
  token: string;
  clientId: string;
  userId: string;
  userEmail: string;
  userRole: string;
  scopes: string[];
  expiresAt: number;
}

export interface PendingAuth {
  id: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  state?: string;
  expiresAt: number;
}

// ── Pending Auth ──

export async function createPendingAuth(params: {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  state?: string;
}): Promise<string> {
  const id = generateId(24);
  const expiresAt = ttlSeconds(10 * 60 * 1000); // 10 min
  await client.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `PENDING#${id}`,
        SK: "PENDING",
        id,
        ...params,
        expiresAt,
        createdAt: Date.now(),
      },
    }),
  );
  // Store a "latest" pointer so getLatestPendingAuth() can find it
  await client.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: "PENDING#latest",
        SK: "PENDING",
        targetId: id,
        expiresAt,
      },
    }),
  );
  return id;
}

export async function getPendingAuth(id: string): Promise<PendingAuth | null> {
  const res = await client.send(
    new GetCommand({
      TableName: TABLE,
      Key: { PK: `PENDING#${id}`, SK: "PENDING" },
    }),
  );
  if (!res.Item) return null;
  if (res.Item.expiresAt < Math.floor(Date.now() / 1000)) return null;
  return res.Item as unknown as PendingAuth;
}

export async function consumePendingAuth(id: string): Promise<PendingAuth | null> {
  const entry = await getPendingAuth(id);
  if (!entry) return null;
  await client.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { PK: `PENDING#${id}`, SK: "PENDING" },
    }),
  );
  return entry;
}

export async function getLatestPendingAuth(): Promise<PendingAuth | null> {
  // Query all pending auths and return the most recent non-expired one
  // Since we can't scan efficiently, we store a pointer
  // For now, this is called rarely (only Clerk dev-mode redirect)
  // so we use a known key
  const res = await client.send(
    new GetCommand({
      TableName: TABLE,
      Key: { PK: "PENDING#latest", SK: "PENDING" },
    }),
  );
  if (!res.Item) return null;
  const id = res.Item.targetId as string;
  return getPendingAuth(id);
}

// ── Client Registration ──

export async function registerClient(params: {
  redirect_uris: string[];
  client_name?: string;
  grant_types?: string[];
  response_types?: string[];
  token_endpoint_auth_method?: string;
}): Promise<OAuthClient> {
  const c: OAuthClient = {
    client_id: generateId(16),
    client_secret: generateId(32),
    redirect_uris: params.redirect_uris,
    client_name: params.client_name,
    grant_types: params.grant_types ?? ["authorization_code"],
    response_types: params.response_types ?? ["code"],
    token_endpoint_auth_method: params.token_endpoint_auth_method ?? "client_secret_post",
    registered_at: Math.floor(Date.now() / 1000),
  };
  await client.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `CLIENT#${c.client_id}`,
        SK: "CLIENT",
        ...c,
        // Clients don't expire via TTL, but set a long one (1 year)
        expiresAt: ttlSeconds(365 * 24 * 60 * 60 * 1000),
      },
    }),
  );
  return c;
}

export async function getClient(clientId: string): Promise<OAuthClient | undefined> {
  const res = await client.send(
    new GetCommand({
      TableName: TABLE,
      Key: { PK: `CLIENT#${clientId}`, SK: "CLIENT" },
    }),
  );
  return res.Item as OAuthClient | undefined;
}

// ── Auth Codes ──

export async function createAuthCode(params: {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  userId: string;
  userEmail: string;
  userRole: string;
  state?: string;
}): Promise<string> {
  const code = generateId(32);
  const expiresAt = ttlSeconds(5 * 60 * 1000); // 5 min
  await client.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `CODE#${code}`,
        SK: "CODE",
        code,
        ...params,
        expiresAt,
      },
    }),
  );
  return code;
}

export async function consumeAuthCode(code: string): Promise<AuthCode | null> {
  const res = await client.send(
    new GetCommand({
      TableName: TABLE,
      Key: { PK: `CODE#${code}`, SK: "CODE" },
    }),
  );
  if (!res.Item) return null;
  // Delete immediately (one-time use)
  await client.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { PK: `CODE#${code}`, SK: "CODE" },
    }),
  );
  if (res.Item.expiresAt < Math.floor(Date.now() / 1000)) return null;
  return res.Item as unknown as AuthCode;
}

// ── Access Tokens ──

export async function createAccessToken(params: {
  clientId: string;
  userId: string;
  userEmail: string;
  userRole: string;
  scopes?: string[];
}): Promise<{ access_token: string; token_type: string; expires_in: number }> {
  const token = generateId(48);
  const expiresIn = 3600; // 1 hour
  const expiresAt = ttlSeconds(expiresIn * 1000);
  await client.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        PK: `TOKEN#${token}`,
        SK: "TOKEN",
        token,
        clientId: params.clientId,
        userId: params.userId,
        userEmail: params.userEmail,
        userRole: params.userRole,
        scopes: params.scopes ?? [],
        expiresAt,
      },
    }),
  );
  return { access_token: token, token_type: "bearer", expires_in: expiresIn };
}

export async function verifyAccessToken(token: string): Promise<AccessToken | null> {
  const res = await client.send(
    new GetCommand({
      TableName: TABLE,
      Key: { PK: `TOKEN#${token}`, SK: "TOKEN" },
    }),
  );
  if (!res.Item) return null;
  if (res.Item.expiresAt < Math.floor(Date.now() / 1000)) return null;
  return res.Item as unknown as AccessToken;
}
