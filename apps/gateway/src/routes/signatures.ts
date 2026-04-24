import { Hono } from "hono";
import type { GatewayEnv } from "../lib/types.js";

const SIGNATURES_API_URL =
  process.env["SIGNATURES_API_URL"] ?? "http://localhost:3007";

// Transparent proxy — forward all /api/signatures/* to signatures-api as /api/*
export const signatureRoutes = new Hono<GatewayEnv>();

signatureRoutes.all("/*", async (c) => {
  const path = c.req.path.replace("/api/signatures", "/api");
  const url = `${SIGNATURES_API_URL}${path}${c.req.url.includes("?") ? "?" + c.req.url.split("?")[1] : ""}`;

  const headers = new Headers(c.req.raw.headers);
  const user = c.get("user");
  if (user) {
    headers.set("x-user-id", user.id);
    headers.set("x-user-email", user.email ?? "");
    headers.set("x-user-role", user.role ?? "");
  }

  const res = await fetch(url, {
    method: c.req.method,
    headers,
    body: c.req.method !== "GET" && c.req.method !== "HEAD" ? c.req.raw.body : undefined,
    // @ts-ignore
    duplex: "half",
  });

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
});

// Public signing routes (no auth) — also proxy to signatures-api
export const publicSignatureRoutes = new Hono<GatewayEnv>();

publicSignatureRoutes.all("/*", async (c) => {
  const path = c.req.path.replace("/sign", "/api/sign");
  const url = `${SIGNATURES_API_URL}${path}${c.req.url.includes("?") ? "?" + c.req.url.split("?")[1] : ""}`;

  const res = await fetch(url, {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.method !== "GET" && c.req.method !== "HEAD" ? c.req.raw.body : undefined,
    // @ts-ignore
    duplex: "half",
  });

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
});
