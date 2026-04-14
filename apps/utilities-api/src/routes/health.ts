import { Hono } from "hono";
import type { UtilitiesEnv } from "../lib/types.js";

const app = new Hono<UtilitiesEnv>();

app.get("/health", (c) => c.json({ status: "ok" }));

export const healthRoutes = app;
