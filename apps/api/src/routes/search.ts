import { Hono } from "hono";
import { db, schema } from "@cometa/db";
import { and, desc, eq, or, sql } from "drizzle-orm";

export const searchRoutes = new Hono();

searchRoutes.get("/", async (c) => {
  const query = c.req.query("q");
  const type = c.req.query("type");

  if (!query) {
    return c.json({ error: "Query parameter 'q' is required" }, 400);
  }

  const searchPattern = `%${query}%`;

  const conditions = [
    or(
      sql`${schema.documents.description} ILIKE ${searchPattern}`,
      sql`${schema.documents.aiSummary} ILIKE ${searchPattern}`,
      sql`${schema.documents.ocrText} ILIKE ${searchPattern}`,
    ),
  ];

  if (type && type !== "all") {
    conditions.push(
      eq(schema.documents.type, type as typeof schema.documents.type.enumValues[number]),
    );
  }

  const documents = await db
    .select()
    .from(schema.documents)
    .where(and(...conditions))
    .orderBy(desc(schema.documents.receivedAt));

  return c.json({ documents, total: documents.length });
});
