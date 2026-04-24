import { Hono } from "hono";
import type { GatewayEnv } from "../lib/types.js";

const INTAKE_API_URL = process.env["INTAKE_API_URL"] ?? "http://localhost:3006";

export const intakeRoutes = new Hono<GatewayEnv>();

// Transparent proxy — forward all /api/intake/* to intake-api as /api/*
intakeRoutes.all("/*", async (c) => {
  const path = c.req.path.replace("/api/intake", "/api");
  const url = `${INTAKE_API_URL}${path}${c.req.url.includes("?") ? "?" + c.req.url.split("?")[1] : ""}`;

  const headers = new Headers(c.req.raw.headers);
  // Forward auth from the gateway's middleware
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
    // @ts-ignore — duplex needed for streaming body
    duplex: "half",
  });

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
});
