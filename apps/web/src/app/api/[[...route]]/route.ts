import { auth } from "@clerk/nextjs/server";
import app from "@/server/app";

async function handler(req: Request) {
  const { userId, sessionClaims } = await auth();

  // Inject Clerk auth info as headers so Hono middleware can read them
  if (userId) {
    const headers = new Headers(req.headers);
    headers.set("X-Clerk-User-Id", userId);
    headers.set(
      "X-Clerk-User-Email",
      (sessionClaims as Record<string, unknown>)?.email as string ?? "",
    );
    const authedReq = new Request(req.url, {
      method: req.method,
      headers,
      body: req.body,
      // @ts-expect-error duplex needed for streaming bodies
      duplex: "half",
    });
    return app.fetch(authedReq);
  }

  return app.fetch(req);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
