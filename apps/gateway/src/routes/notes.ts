import { Hono } from "hono";
import type { GatewayEnv } from "../lib/types.js";

const NOTES_API_URL = process.env["NOTES_API_URL"] ?? "http://localhost:3008";

// Transparent proxy — forward all /api/notes/* to notes-api as /api/notes/*
export const noteRoutes = new Hono<GatewayEnv>();

noteRoutes.all("/*", async (c) => {
  const path = c.req.path.replace("/api/notes", "/api/notes");
  const url = `${NOTES_API_URL}${path}${c.req.url.includes("?") ? "?" + c.req.url.split("?")[1] : ""}`;

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
