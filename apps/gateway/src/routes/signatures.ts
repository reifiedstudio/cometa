import { Hono } from "hono";
import type { GatewayEnv } from "../lib/types.js";

const SIGNATURES_API_URL =
  process.env["SIGNATURES_API_URL"] ??
  process.env["SIGNATURES_MCP_URL"]?.replace(/\/mcp\/?$/, "") ??
  "http://localhost:3007";

async function sigFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${SIGNATURES_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  return res;
}

// ── Authenticated routes (internal users) ──

export const signatureRoutes = new Hono<GatewayEnv>();

// Create a signature request for a document
signatureRoutes.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  const { documentId, signerEmails, message, expiresInDays } = body;

  if (!documentId || !signerEmails?.length) {
    return c.json({ error: "documentId and signerEmails are required" }, 400);
  }

  // Build form data for signatures service
  const formData = new FormData();
  formData.append("signerEmails", JSON.stringify(signerEmails));
  if (message) formData.append("message", message);
  if (documentId) formData.append("sourceRef", documentId);
  if (expiresInDays) formData.append("expiresInDays", String(expiresInDays));
  formData.append("fileHash", documentId); // Use doc ID as hash placeholder

  const res = await fetch(`${SIGNATURES_API_URL}/api/requests`, {
    method: "POST",
    headers: {
      "X-User-Id": user.id,
      "X-User-Email": user.email,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    return c.json({ error: `Signatures service error: ${err}` }, res.status as any);
  }

  return c.json(await res.json(), 201);
});

// Get signature status for a document
signatureRoutes.get("/document/:documentId", async (c) => {
  const documentId = c.req.param("documentId");
  const res = await sigFetch(`/api/requests/source/${documentId}`);

  if (!res.ok) {
    return c.json({ error: "No signature request found" }, 404);
  }

  return c.json(await res.json());
});

// ── Public routes (external signers, no auth) ──

export const publicSignatureRoutes = new Hono<GatewayEnv>();

// Get signing page data
publicSignatureRoutes.get("/:token", async (c) => {
  const token = c.req.param("token");
  const res = await sigFetch(`/api/sign/${token}`);

  if (!res.ok) {
    return c.json({ error: "Invalid or expired signing link" }, 404);
  }

  return c.json(await res.json());
});

// Send OTP
publicSignatureRoutes.post("/:token/otp", async (c) => {
  const token = c.req.param("token");
  const res = await sigFetch(`/api/sign/${token}/otp`, { method: "POST" });

  if (!res.ok) {
    return c.json({ error: "Invalid signing link" }, 404);
  }

  return c.json(await res.json());
});

// Verify OTP
publicSignatureRoutes.post("/:token/verify", async (c) => {
  const token = c.req.param("token");
  const body = await c.req.json();

  const res = await sigFetch(`/api/sign/${token}/verify`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Verification failed" }));
    return c.json(err, res.status as any);
  }

  return c.json(await res.json());
});

// Complete signing
publicSignatureRoutes.post("/:token/sign", async (c) => {
  const token = c.req.param("token");
  const body = await c.req.json();

  const res = await sigFetch(`/api/sign/${token}/sign`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": c.req.header("x-forwarded-for") ?? "",
      "User-Agent": c.req.header("user-agent") ?? "",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Signing failed" }));
    return c.json(err, res.status as any);
  }

  return c.json(await res.json());
});
