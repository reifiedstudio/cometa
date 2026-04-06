/**
 * OAuth 2.0 routes for MCP authentication.
 *
 * Implements the endpoints Claude Cowork expects:
 * - Discovery metadata (RFC 8414 + RFC 9728)
 * - Dynamic client registration (RFC 7591)
 * - Authorization (PKCE)
 * - Token exchange
 */
import { Hono } from "hono";
import type { GatewayEnv } from "../lib/types.js";
import {
  registerClient,
  getClient,
  createAuthCode,
  consumeAuthCode,
  createAccessToken,
  createPendingAuth,
  getPendingAuth,
  consumePendingAuth,
} from "./store.js";

const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

function getIssuerUrl(c: { req: { url: string } }): string {
  const url = new URL(c.req.url);
  return `${url.protocol}//${url.host}`;
}

export function createOAuthRoutes(): Hono<GatewayEnv> {
  const oauth = new Hono<GatewayEnv>();

  // ── RFC 9728: Protected Resource Metadata ──
  oauth.get("/.well-known/oauth-protected-resource", (c) => {
    const issuer = getIssuerUrl(c);
    return c.json({
      resource: `${issuer}/mcp`,
      authorization_servers: [issuer],
      bearer_methods_supported: ["header"],
    });
  });

  // ── RFC 8414: Authorization Server Metadata ──
  oauth.get("/.well-known/oauth-authorization-server", (c) => {
    const issuer = getIssuerUrl(c);
    return c.json({
      issuer,
      authorization_endpoint: `${issuer}/oauth/authorize`,
      token_endpoint: `${issuer}/oauth/token`,
      registration_endpoint: `${issuer}/oauth/register`,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code"],
      token_endpoint_auth_methods_supported: ["client_secret_post"],
      code_challenge_methods_supported: ["S256"],
      scopes_supported: ["read", "write"],
    });
  });

  // ── RFC 7591: Dynamic Client Registration ──
  oauth.post("/oauth/register", async (c) => {
    const body = await c.req.json();

    if (!body.redirect_uris || !Array.isArray(body.redirect_uris) || body.redirect_uris.length === 0) {
      return c.json({ error: "invalid_client_metadata", error_description: "redirect_uris required" }, 400);
    }

    const client = registerClient({
      redirect_uris: body.redirect_uris,
      client_name: body.client_name,
      grant_types: body.grant_types,
      response_types: body.response_types,
      token_endpoint_auth_method: body.token_endpoint_auth_method,
    });

    return c.json({
      client_id: client.client_id,
      client_secret: client.client_secret,
      client_name: client.client_name,
      redirect_uris: client.redirect_uris,
      grant_types: client.grant_types,
      response_types: client.response_types,
      token_endpoint_auth_method: client.token_endpoint_auth_method,
      client_id_issued_at: client.registered_at,
      client_secret_expires_at: 0, // never expires
    }, 201);
  });

  // ── Authorization Endpoint ──
  // Stores OAuth params and redirects to Clerk's hosted sign-in.
  // After sign-in, Clerk redirects back to /oauth/clerk-callback which
  // exchanges the session for an auth code.
  oauth.get("/oauth/authorize", (c) => {
    const clientId = c.req.query("client_id");
    const redirectUri = c.req.query("redirect_uri");
    const state = c.req.query("state");
    const codeChallenge = c.req.query("code_challenge");
    const codeChallengeMethod = c.req.query("code_challenge_method") ?? "S256";

    if (!clientId || !redirectUri || !codeChallenge) {
      return c.json({ error: "invalid_request", error_description: "Missing required parameters" }, 400);
    }

    const client = getClient(clientId);
    if (!client) {
      return c.json({ error: "invalid_client", error_description: "Client not found" }, 400);
    }

    if (!client.redirect_uris.includes(redirectUri)) {
      return c.json({ error: "invalid_request", error_description: "Redirect URI not registered" }, 400);
    }

    // Store the OAuth params so we can retrieve them after Clerk sign-in
    const oauthState = createPendingAuth({
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      state,
    });

    // Decode the Clerk frontend API domain from the publishable key
    const keyData = CLERK_PUBLISHABLE_KEY.replace(/^pk_(test|live)_/, "");
    const clerkDomain = atob(keyData).replace(/\$$/, "");

    const issuer = getIssuerUrl(c);
    const afterSignInUrl = `${issuer}/oauth/clerk-callback?oauth_state=${oauthState}`;

    // Redirect to Clerk's Account Portal sign-in
    // Dev: frontend API is <slug>.clerk.accounts.dev → Account Portal is <slug>.accounts.dev
    const accountPortalDomain = clerkDomain.replace(".clerk.accounts.dev", ".accounts.dev");
    const clerkSignInUrl = `https://${accountPortalDomain}/sign-in?redirect_url=${encodeURIComponent(afterSignInUrl)}`;

    return c.redirect(clerkSignInUrl);
  });

  // ── Clerk Callback ──
  // After Clerk sign-in, user is redirected here with a __session cookie.
  // We verify the session, create an auth code, and redirect back to Cowork.
  oauth.get("/oauth/clerk-callback", async (c) => {
    const oauthStateId = c.req.query("oauth_state");

    if (!oauthStateId) {
      return c.text("Missing oauth_state parameter", 400);
    }

    const pending = getPendingAuth(oauthStateId);
    if (!pending) {
      return c.text("Invalid or expired authorization session", 400);
    }

    // Clerk's session cookie is on Clerk's domain, not ours.
    // So we always serve a small page that loads Clerk JS, grabs the
    // session token, and POSTs it to /oauth/complete.
    const issuer = getIssuerUrl(c);

    const html = `<!DOCTYPE html>
<html><head><title>Completing sign-in...</title>
<style>body{font-family:system-ui;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh}
.c{text-align:center}p{color:#888}.e{color:#ef4444;margin-top:1rem}</style>
</head><body><div class="c"><p>Completing authentication...</p><p id="e" class="e" hidden></p></div>
<script>
(async()=>{try{
  const s=document.createElement("script");
  s.setAttribute("data-clerk-publishable-key",${JSON.stringify(CLERK_PUBLISHABLE_KEY)});
  s.src="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js";
  s.crossOrigin="anonymous";
  document.head.appendChild(s);
  await new Promise((r,j)=>{s.onload=r;s.onerror=()=>j(new Error("Failed to load Clerk"))});
  await window.Clerk.load();
  const clerk=window.Clerk;
  if(!clerk.session){document.getElementById("e").textContent="Not signed in. Please try again.";document.getElementById("e").hidden=false;return}
  const token=await clerk.session.getToken();
  const r=await fetch("${issuer}/oauth/complete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_token:token,oauth_state:${JSON.stringify(oauthStateId)}})});
  const d=await r.json();
  if(d.redirect_to){window.location.href=d.redirect_to}
  else{document.getElementById("e").textContent=d.error_description||"Auth failed";document.getElementById("e").hidden=false}
}catch(e){document.getElementById("e").textContent=e.message;document.getElementById("e").hidden=false}})();
</script></body></html>`;

    return c.html(html);
  });

  // ── OAuth Complete ──
  // Called by the clerk-callback page after it gets the session token from Clerk JS.
  oauth.post("/oauth/complete", async (c) => {
    const body = await c.req.json();
    const { session_token, oauth_state } = body;

    if (!session_token || !oauth_state) {
      return c.json({ error: "invalid_request" }, 400);
    }

    const pending = consumePendingAuth(oauth_state);
    if (!pending) {
      return c.json({ error: "invalid_request", error_description: "Invalid or expired session" }, 400);
    }

    let userId: string;
    let userEmail: string;
    let userRole: string;

    try {
      const { verifyToken } = await import("@clerk/backend");
      const payload = await verifyToken(session_token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      userId = payload.sub;
      userEmail = (payload as Record<string, unknown>).email as string ?? "";
      userRole = (payload as Record<string, unknown>).role as string ?? "member";
    } catch (err) {
      console.error("Token verification failed:", err);
      return c.json({ error: "invalid_grant", error_description: "Invalid session token" }, 400);
    }

    const code = createAuthCode({
      clientId: pending.clientId,
      redirectUri: pending.redirectUri,
      codeChallenge: pending.codeChallenge,
      codeChallengeMethod: pending.codeChallengeMethod,
      userId,
      userEmail,
      userRole,
      state: pending.state,
    });

    const redirectUrl = new URL(pending.redirectUri);
    redirectUrl.searchParams.set("code", code);
    if (pending.state) redirectUrl.searchParams.set("state", pending.state);

    return c.json({ redirect_to: redirectUrl.toString() });
  });

  // ── Token Endpoint ──
  oauth.post("/oauth/token", async (c) => {
    const body = await c.req.parseBody();
    const grantType = body.grant_type as string;

    if (grantType !== "authorization_code") {
      return c.json({ error: "unsupported_grant_type" }, 400);
    }

    const code = body.code as string;
    const clientId = body.client_id as string;
    const codeVerifier = body.code_verifier as string;

    if (!code || !clientId || !codeVerifier) {
      return c.json({ error: "invalid_request", error_description: "Missing required parameters" }, 400);
    }

    const client = getClient(clientId);
    if (!client) {
      return c.json({ error: "invalid_client" }, 400);
    }

    const authCode = consumeAuthCode(code);
    if (!authCode) {
      return c.json({ error: "invalid_grant", error_description: "Invalid or expired authorization code" }, 400);
    }

    if (authCode.clientId !== clientId) {
      return c.json({ error: "invalid_grant", error_description: "Client mismatch" }, 400);
    }

    // Verify PKCE: S256 = BASE64URL(SHA256(code_verifier)) must match code_challenge
    if (authCode.codeChallengeMethod === "S256") {
      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await crypto.subtle.digest("SHA-256", data);
      const base64url = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      if (base64url !== authCode.codeChallenge) {
        return c.json({ error: "invalid_grant", error_description: "PKCE verification failed" }, 400);
      }
    }

    // Issue access token
    const tokenResponse = createAccessToken({
      clientId,
      userId: authCode.userId,
      userEmail: authCode.userEmail,
      userRole: authCode.userRole,
    });

    return c.json(tokenResponse);
  });

  return oauth;
}
