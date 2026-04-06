/**
 * In-memory OAuth store for development.
 * Stores registered clients, auth codes, and access tokens.
 * All state is lost on restart — fine for dev, replace with DB/Redis for prod.
 */

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

// ── Stores ──

const clients = new Map<string, OAuthClient>();
const authCodes = new Map<string, AuthCode>();
const accessTokens = new Map<string, AccessToken>();
const pendingAuths = new Map<string, PendingAuth>();

function generateId(length = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Pending Auth (OAuth params stored during Clerk redirect) ──

export function createPendingAuth(params: {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  state?: string;
}): string {
  const id = generateId(24);
  pendingAuths.set(id, {
    id,
    ...params,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
  });
  return id;
}

export function getPendingAuth(id: string): PendingAuth | null {
  const entry = pendingAuths.get(id);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    pendingAuths.delete(id);
    return null;
  }
  return entry;
}

export function consumePendingAuth(id: string): PendingAuth | null {
  const entry = getPendingAuth(id);
  if (!entry) return null;
  pendingAuths.delete(id);
  return entry;
}

// ── Client Registration ──

export function registerClient(params: {
  redirect_uris: string[];
  client_name?: string;
  grant_types?: string[];
  response_types?: string[];
  token_endpoint_auth_method?: string;
}): OAuthClient {
  const client: OAuthClient = {
    client_id: generateId(16),
    client_secret: generateId(32),
    redirect_uris: params.redirect_uris,
    client_name: params.client_name,
    grant_types: params.grant_types ?? ["authorization_code"],
    response_types: params.response_types ?? ["code"],
    token_endpoint_auth_method: params.token_endpoint_auth_method ?? "client_secret_post",
    registered_at: Math.floor(Date.now() / 1000),
  };
  clients.set(client.client_id, client);
  return client;
}

export function getClient(clientId: string): OAuthClient | undefined {
  return clients.get(clientId);
}

// ── Auth Codes ──

export function createAuthCode(params: {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  userId: string;
  userEmail: string;
  userRole: string;
  state?: string;
}): string {
  const code = generateId(32);
  authCodes.set(code, {
    code,
    ...params,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
  });
  return code;
}

export function consumeAuthCode(code: string): AuthCode | null {
  const entry = authCodes.get(code);
  if (!entry) return null;
  authCodes.delete(code); // one-time use
  if (Date.now() > entry.expiresAt) return null;
  return entry;
}

// ── Access Tokens ──

export function createAccessToken(params: {
  clientId: string;
  userId: string;
  userEmail: string;
  userRole: string;
  scopes?: string[];
}): { access_token: string; token_type: string; expires_in: number } {
  const token = generateId(48);
  const expiresIn = 3600; // 1 hour
  accessTokens.set(token, {
    token,
    clientId: params.clientId,
    userId: params.userId,
    userEmail: params.userEmail,
    userRole: params.userRole,
    scopes: params.scopes ?? [],
    expiresAt: Date.now() + expiresIn * 1000,
  });
  return { access_token: token, token_type: "bearer", expires_in: expiresIn };
}

export function verifyAccessToken(token: string): AccessToken | null {
  const entry = accessTokens.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    accessTokens.delete(token);
    return null;
  }
  return entry;
}
